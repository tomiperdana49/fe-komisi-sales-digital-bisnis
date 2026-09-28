#!/usr/bin/env bash
# Pull the latest code, rebuild, and restart the frontend if it runs as a process.
#
# Usage:
#   ./deploy.sh                                  # restart is auto-detected (PM2 / systemd)
#   RESTART_CMD="pm2 restart fe-komisi" ./deploy.sh
#   FORCE=1 ./deploy.sh                          # rebuild even without new commits
#
# If nginx serves .output/public directly, no restart is needed and none is attempted.

set -euo pipefail

cd "$(dirname "$0")"
APP_DIR=$(pwd)

log() { echo "[deploy] $*"; }

if command -v pnpm >/dev/null 2>&1; then
    PNPM=(pnpm)
else
    PNPM=(corepack pnpm)
fi

restart_app() {
    if [ -n "${RESTART_CMD:-}" ]; then
        log "Restart: $RESTART_CMD"
        eval "$RESTART_CMD"
        return
    fi

    if command -v pm2 >/dev/null 2>&1; then
        local name
        name=$(pm2 jlist 2>/dev/null | APP_DIR="$APP_DIR" node -e '
            let input = "";
            process.stdin.on("data", c => input += c).on("end", () => {
                const list = JSON.parse(input || "[]");
                const app = list.find(p => p.pm2_env?.pm_cwd?.replace(/\/$/, "") === process.env.APP_DIR);
                if (app) console.log(app.name);
            });
        ' || true)
        if [ -n "$name" ]; then
            log "Restart PM2 process: $name"
            pm2 restart "$name"
            return
        fi
    fi

    local unit
    unit=$(grep -lE "^WorkingDirectory=$APP_DIR/?$" /etc/systemd/system/*.service 2>/dev/null | head -1 || true)
    if [ -n "$unit" ]; then
        log "Restart systemd service: $(basename "$unit")"
        sudo systemctl restart "$(basename "$unit")"
        return
    fi

    log "No PM2 / systemd process found for $APP_DIR; assuming nginx serves .output/public (no restart needed)"
}

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    log "Aborted: there are local changes on the server:"
    git status --short --untracked-files=no
    exit 1
fi

api_url=$(grep -E '^API_BASE_URL=' .env 2>/dev/null | cut -d= -f2- || true)
if [ -z "$api_url" ]; then
    log "Aborted: API_BASE_URL is missing in .env (it is baked into the build)"
    exit 1
fi
case "$api_url" in
    *localhost*|*127.0.0.1*) log "Warning: API_BASE_URL points to $api_url" ;;
esac

before=$(git rev-parse HEAD)
log "Pulling latest code..."
git pull --ff-only
after=$(git rev-parse HEAD)

if [ "$before" = "$after" ] && [ "${FORCE:-}" != "1" ]; then
    log "Already up to date ($(git log -1 --format='%h %s'))"
    exit 0
fi

git log --oneline "$before..$after"

log "Installing dependencies..."
"${PNPM[@]}" install --frozen-lockfile

log "Building (API_BASE_URL=$api_url)..."
"${PNPM[@]}" build

restart_app
log "Done: $(git log -1 --format='%h %s')"
