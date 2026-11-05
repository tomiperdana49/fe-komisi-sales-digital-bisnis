<template>
    <div
        class="flex items-center gap-6 rounded-2xl px-6"
        :class="medal ? `rank-row--${medal}` : ''"
        :style="{ height: `${height}px`, marginBottom: '8px' }"
    >
        <span v-if="medal" class="medal" :class="`medal--${medal}`">
            <UIcon v-if="rank === 1" name="i-lucide-crown" class="medal-crown" />
            {{ rank }}
        </span>
        <span v-else class="w-14 text-center text-4xl font-black tabular-nums text-slate-400">{{ hasMrc ? rank : '–' }}</span>
        <div class="relative shrink-0">
            <UAvatar :src="photoProfile" :alt="name" class="size-14 text-xl ring-2" :class="medal ? `avatar--${medal}` : 'ring-white'" />
            <span v-if="badge" class="badge absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 text-[11px] font-black text-white">{{ badge }}</span>
        </div>
        <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3">
                <p class="truncate text-[32px] font-extrabold leading-tight text-navy">{{ name }}</p>
                <span v-if="isNewJoiner" class="new-joiner"><UIcon name="i-lucide-sparkles" class="size-4" /> AM BARU</span>
            </div>
            <p class="truncate text-lg font-extrabold text-brand">{{ hint }}</p>
        </div>
        <div v-if="achievementPercentage !== null" class="w-[220px] shrink-0 text-right">
            <p class="text-[34px] font-black leading-none tabular-nums" :class="achievementPercentage >= 100 ? 'text-gold' : 'text-navy'">{{ formatAchievement(achievementPercentage) }}</p>
            <div class="progress mt-2">
                <div class="progress-fill" :class="achievementPercentage >= 100 ? 'progress-fill--done' : ''" :style="{ width: `${Math.min(achievementPercentage, 100)}%` }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatAchievement } from '~/services/tv-service'

defineProps<{
    rank: number
    name: string
    photoProfile: string
    hint: string
    hasMrc: boolean
    achievementPercentage: number | null
    isNewJoiner: boolean
    medal: 'gold' | 'silver' | 'bronze' | null
    badge: string | null
    height: number
}>()
</script>

<style scoped>
.text-navy { color: #2b1215; }
.text-brand { color: #d00000; }
.badge { background-color: #e80000; }
.text-gold { color: #b45309; }
.new-joiner {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 4px;
    border-radius: 9999px;
    padding: 3px 12px;
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 0.06em;
    color: #ffffff;
    background: linear-gradient(90deg, #f80000, #c40000);
}
.progress {
    height: 10px;
    overflow: hidden;
    border-radius: 9999px;
    background: rgba(43, 18, 21, 0.1);
}
.progress-fill {
    height: 100%;
    border-radius: 9999px;
    background: linear-gradient(90deg, #f80000, #c40000);
    transition: width 0.6s ease;
}
.progress-fill--done { background: linear-gradient(90deg, #f59e0b, #facc15); }
.rank-row--gold {
    background: linear-gradient(90deg, rgba(250, 204, 21, 0.30), rgba(250, 204, 21, 0.06));
    box-shadow: inset 6px 0 0 #eab308, 0 8px 24px -14px rgba(161, 98, 7, 0.6);
}
.rank-row--silver {
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.28), rgba(148, 163, 184, 0.05));
    box-shadow: inset 6px 0 0 #94a3b8;
}
.rank-row--bronze {
    background: linear-gradient(90deg, rgba(217, 119, 6, 0.22), rgba(217, 119, 6, 0.04));
    box-shadow: inset 6px 0 0 #c2702a;
}
.medal {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    font-size: 30px;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    border: 3px solid rgba(255, 255, 255, 0.85);
}
.medal--gold { background: radial-gradient(circle at 30% 25%, #fef08a, #eab308 55%, #a16207); box-shadow: 0 0 18px rgba(234, 179, 8, 0.65); }
.medal--silver { background: radial-gradient(circle at 30% 25%, #f8fafc, #94a3b8 55%, #475569); }
.medal--bronze { background: radial-gradient(circle at 30% 25%, #fed7aa, #c2702a 55%, #7c2d12); }
.medal-crown {
    position: absolute;
    top: -22px;
    width: 26px;
    height: 26px;
    color: #eab308;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
}
.avatar--gold { --tw-ring-color: #eab308; }
.avatar--silver { --tw-ring-color: #94a3b8; }
.avatar--bronze { --tw-ring-color: #c2702a; }
</style>
