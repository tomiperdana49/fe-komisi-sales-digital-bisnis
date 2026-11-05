<template>
    <div class="tv-viewport">
        <div class="tv-canvas" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
            <div class="tv-stripe" />
            <!-- Awan samar seperti pada logo nusa.id -->
            <svg class="tv-cloud" viewBox="0 0 640 400" aria-hidden="true"><path d="M160 360a130 130 0 0 1-22-258 170 170 0 0 1 318-30 118 118 0 0 1 44 288z" /></svg>

            <img src="/logo.webp" alt="Nusanet" class="absolute right-24 top-16 h-16" />

            <div v-if="error" class="flex h-full items-center justify-center text-4xl text-slate-500">{{ error }}</div>
            <div v-else-if="!data" class="flex h-full items-center justify-center text-4xl text-slate-500">Memuat data…</div>

            <template v-else>
                <header class="px-20 pt-16">
                    <p class="text-[28px] font-extrabold tracking-[0.18em] text-navy">{{ monthName(data.current.month).toUpperCase() }} {{ data.current.year }} · {{ daysLeftLabel }}</p>
                    <h1 class="mt-3 max-w-[1440px] text-[72px] font-black leading-[0.98] tracking-tight">
                        <span class="text-navy">WHO'S NEXT? </span><span class="text-brand">BEST MRC ACHIEVEMENT</span>
                    </h1>
                    <p class="mt-4 text-[28px] font-extrabold tracking-[0.12em] text-navy">{{ board?.role }} · DIGITAL BISNIS</p>
                </header>

                <main class="absolute bottom-16 left-20 right-28 top-[300px] flex gap-14">
                    <section class="w-[520px] shrink-0">
                        <p class="mb-5 text-[22px] font-extrabold tracking-[0.16em] text-slate-500">{{ monthName(data.previous.month).toUpperCase() }} WINNER</p>
                        <!-- Foto Nusawork hanya 300x300: tampil sebagai medali di ukuran aslinya supaya tetap tajam dan latar kantor terpotong. -->
                        <div v-if="winner" :key="board?.key" class="champ-card relative flex h-[620px] flex-col items-center overflow-hidden rounded-[28px] px-8 pt-6 text-center text-white">
                            <div class="champ-rays" />
                            <span v-for="n in 6" :key="n" class="champ-spark" :class="`champ-spark--${n}`">✦</span>

                            <span class="champ-tag relative z-10">★ BEST OF {{ monthName(data.previous.month).toUpperCase() }}</span>
                            <div class="champ-medal relative z-10 mt-9">
                                <UIcon name="i-lucide-crown" class="champ-crown" />
                                <div class="champ-ring" />
                                <img :src="winner.photoProfile" :alt="winner.name" class="champ-photo" />
                                <span v-if="winner.achievementPercentage !== null" class="champ-score">{{ formatAchievement(winner.achievementPercentage) }} <small>DARI TARGET</small></span>
                            </div>
                            <p class="relative z-10 mt-8 font-black uppercase leading-[1.05] tracking-tight" :style="{ fontSize: `${nameSize(winner.name)}px` }">{{ winner.name }}</p>
                            <div class="champ-divider relative z-10" />
                            <p class="relative z-10 text-xl font-bold tracking-[0.18em] text-red-100">{{ board?.role }}</p>
                            <p class="champ-title relative z-10 mt-2"><UIcon name="i-lucide-trophy" class="size-7" /> BEST MRC ACHIEVEMENT</p>
                        </div>
                        <div v-else class="flex h-[620px] items-center justify-center rounded-[28px] bg-white/70 text-2xl text-slate-400">Belum ada pemenang</div>
                    </section>

                    <div class="w-px bg-slate-300/70" />

                    <section class="min-w-0 flex-1">
                        <p class="mb-5 text-[22px] font-extrabold tracking-[0.16em] text-slate-500">{{ monthName(data.current.month).toUpperCase() }} RANKING</p>
                        <TvRankRow v-for="r in ranking.slice(0, PINNED)" :key="r.name" v-bind="r" :height="ROW_PX - 8" />
                        <template v-if="ranking.length > PINNED">
                            <div class="chase-divider"><span>THE CHASERS</span></div>
                            <div class="tv-list overflow-hidden" :style="{ height: `${VISIBLE_CHASERS * ROW_PX - 8}px` }">
                                <div class="tv-list-inner" :style="{ transform: `translate3d(0, -${scrollOffset}px, 0)` }">
                                    <TvRankRow v-for="r in ranking.slice(PINNED)" :key="r.name" v-bind="r" :height="ROW_PX - 8" />
                                </div>
                            </div>
                        </template>
                        <p v-if="!ranking.length" class="py-10 text-2xl text-slate-400">Belum ada data bulan ini.</p>
                    </section>
                </main>

                <footer class="absolute bottom-5 left-20 right-44 flex items-center justify-between text-lg text-slate-500">
                    <div class="flex items-center gap-2">
                        <template v-if="boards.length > 1">
                            <span v-for="(b, i) in boards" :key="b.key" class="h-2.5 rounded-full transition-all" :class="i === boardIndex % boards.length ? 'w-10 bg-red-600' : 'w-2.5 bg-slate-300'" />
                        </template>
                    </div>
                    <span class="flex items-center gap-2">
                        <span class="inline-flex size-3 rounded-full" :class="stale ? 'bg-amber-400' : 'bg-red-500 animate-pulse'" />
                        {{ stale ? 'Menyambung ulang…' : 'LIVE' }} · diperbarui {{ updatedAt }}
                    </span>
                </footer>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatAchievement, tvService, type TvMrcData } from '~/services/tv-service'

// TV lounge: tanpa header dan login (BE memeriksa ?key=), ukuran 1920x1080 lalu di-scale agar pas.
definePageMeta({ layout: false })
useHead({ title: "Who's Next? Best MRC Achievement" })

const REFRESH_MS = 60 * 1000
/** Tiga teratas diam sebagai podium; sisanya bergulir supaya yang paling bawah ikut terlihat. */
const PINNED = 3
const VISIBLE_CHASERS = 4
const ROW_PX = 88
const MEDALS = ['gold', 'silver', 'bronze'] as const
const SCROLL_PX_PER_SECOND = 45
const HOLD_MS = 2500
/** Lama tiap papan (AM, SM) tampil sebelum berganti. */
const BOARD_MS = 20000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const route = useRoute()
const key = computed(() => String(route.query.key ?? ''))
// ?screen=am atau ?screen=sm mengunci satu papan; tanpa itu keduanya bergantian.
const screen = computed(() => String(route.query.screen ?? ''))

const data = ref<TvMrcData | null>(null)
const error = ref('')
const stale = ref(false)
const scale = ref(1)
const scrollOffset = ref(0)
const boardIndex = ref(0)

const monthName = (month: number) => MONTHS[month - 1]!
const monthShort = (month: number) => monthName(month).slice(0, 3).toUpperCase()
const firstName = (name: string) => name.split(' ')[0]
/** Nama panjang mengecil (maksimal dua baris), tidak dipotong. */
const nameSize = (name: string) => name.length <= 14 ? 46 : name.length <= 22 ? 40 : 34

const boards = computed(() => {
    if (!data.value) return []
    const { previous, current } = data.value
    return [
        { key: 'am', role: 'ACCOUNT MANAGER', label: 'Account Manager', previous: previous.rows, current: current.rows },
        { key: 'sm', role: 'SALES MANAGER', label: 'Sales Manager', previous: previous.managers, current: current.managers }
    ].filter(b => screen.value ? b.key === screen.value : b.previous.length || b.current.length)
})
const board = computed(() => boards.value[boardIndex.value % Math.max(1, boards.value.length)])

const winner = computed(() => {
    const top = board.value?.previous[0]
    return top?.hasMrc ? top : null
})

const ranking = computed(() => (board.value?.current ?? []).map((row, i, rows) => {
    const rank = i + 1
    // Target berikutnya: podium untuk peringkat 4-6, selain itu orang tepat di atasnya.
    const target = rank >= 4 && rank <= 6 ? rows[2] : rows[i - 1]
    let hint = board.value!.label
    if (!row.hasMrc) hint = 'Ayo buka MRC pertama bulan ini!'
    else if (target) hint = target === rows[2] && rank > 3 ? 'Ayo masuk Top 3!' : `Ayo salip ${firstName(target.name)}!`
    return {
        rank,
        name: row.name,
        photoProfile: row.photoProfile,
        hasMrc: row.hasMrc,
        achievementPercentage: row.achievementPercentage,
        isNewJoiner: row.isNewJoiner,
        hint,
        medal: row.hasMrc ? MEDALS[i] ?? null : null,
        badge: row.name === winner.value?.name ? `BEST ${monthShort(data.value!.previous.month)}` : null
    }
}))

const daysLeftLabel = computed(() => {
    if (!data.value) return ''
    const end = new Date(`${data.value.current.endDate}T23:59:59`)
    const days = Math.ceil((end.getTime() - Date.now()) / 86_400_000)
    return days <= 1 ? 'LAST DAY' : `${days} DAYS LEFT`
})

const updatedAt = computed(() => data.value
    ? new Date(data.value.generatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')
    : '')

/** Jarak gulir: semua baris di bawah podium dikurangi yang muat di layar. */
const maxOffset = computed(() => Math.max(0, (ranking.value.length - PINNED - VISIBLE_CHASERS) * ROW_PX))

/** Tahan di atas, gulir ke bawah, tahan, lalu kembali ke atas. */
let holdUntil = 0
let lastFrame = 0
let frame = 0
let boardStart = 0
const animate = (t: number) => {
    // Dibatasi supaya frame setelah tab tersembunyi tidak melompat.
    const elapsed = lastFrame ? Math.min(100, t - lastFrame) : 0
    lastFrame = t
    if (!boardStart) boardStart = t
    if (boards.value.length > 1 && t - boardStart >= BOARD_MS) {
        boardIndex.value = (boardIndex.value + 1) % boards.value.length
        boardStart = t
        scrollOffset.value = 0
        holdUntil = t + HOLD_MS
    }
    if (!holdUntil) holdUntil = t + HOLD_MS
    if (t >= holdUntil) {
        if (scrollOffset.value >= maxOffset.value) {
            scrollOffset.value = 0
            holdUntil = t + HOLD_MS
        } else {
            scrollOffset.value = Math.min(maxOffset.value, scrollOffset.value + elapsed / 1000 * SCROLL_PX_PER_SECOND)
            if (scrollOffset.value >= maxOffset.value) holdUntil = t + HOLD_MS
        }
    }
    frame = requestAnimationFrame(animate)
}

const load = async () => {
    if (!key.value) {
        error.value = 'Alamat tampilan TV belum lengkap (key tidak ada).'
        return
    }
    try {
        data.value = await tvService.mrc(key.value)
        error.value = ''
        stale.value = false
    } catch (e: any) {
        // Saat jaringan putus tetap tampilkan data terakhir; key salah diberi pesan.
        if (e?.response?.status === 404) error.value = 'Key tampilan TV tidak valid.'
        else stale.value = true
    }
}

const fit = () => { scale.value = Math.min(window.innerWidth / 1920, window.innerHeight / 1080) }

let refreshTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
    fit()
    window.addEventListener('resize', fit)
    frame = requestAnimationFrame(animate)
    refreshTimer = setInterval(load, REFRESH_MS)
    load()
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', fit)
    cancelAnimationFrame(frame)
    clearInterval(refreshTimer)
})
</script>

<style scoped>
.tv-viewport {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #fff1f1;
}
.tv-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    transform-origin: center;
    font-family: 'Public Sans', sans-serif;
    background:
        radial-gradient(900px 700px at 15% 85%, rgba(248, 0, 0, 0.10), transparent),
        linear-gradient(135deg, #ffffff 0%, #fff8f8 60%, #ffeeee 100%);
}
.tv-stripe {
    position: absolute;
    top: -10%;
    right: 18px;
    width: 46px;
    height: 120%;
    background: linear-gradient(180deg, #f80000, #c40000);
    transform: skewX(-6deg);
}
.tv-cloud {
    position: absolute;
    top: -40px;
    right: 240px;
    width: 620px;
    fill: #f80000;
    opacity: 0.05;
}
.text-navy { color: #2b1215; }
.text-brand { color: #e80000; }
/* Kartu juara: panggung merah logo, sinar berputar, medali foto bercincin emas. */
.champ-card {
    background: radial-gradient(circle at 50% 244px, #ff3b30 0%, #f80000 28%, #a50000 62%, #4a0000 100%);
    box-shadow: 0 0 0 5px #facc15, 0 0 0 9px #ffffff, 0 30px 60px -20px rgba(120, 0, 0, 0.6);
    animation: champ-enter 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
/* Kilau yang menyapu kartu. */
.champ-card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 20;
    pointer-events: none;
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.28) 50%, transparent 60%);
    transform: translateX(-120%);
    animation: champ-shine 7s ease-in-out 1.2s infinite;
}
.champ-rays {
    position: absolute;
    top: -256px;
    left: 50%;
    width: 1000px;
    height: 1000px;
    margin-left: -500px;
    background: repeating-conic-gradient(rgba(255, 255, 255, 0.11) 0deg 6deg, transparent 6deg 18deg);
    mask-image: radial-gradient(circle, black 15%, transparent 62%);
    animation: champ-spin 60s linear infinite;
}
.champ-tag {
    border-radius: 9999px;
    padding: 6px 22px;
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #5c0000;
    background: linear-gradient(180deg, #fde68a, #f59e0b);
    box-shadow: 0 6px 16px rgba(74, 0, 0, 0.45);
}
.champ-medal {
    width: 280px;
    height: 280px;
    flex-shrink: 0;
    animation: champ-pop 0.7s cubic-bezier(0.3, 1.5, 0.5, 1) 0.3s both;
}
.champ-ring {
    position: absolute;
    inset: -10px;
    border-radius: 9999px;
    background: conic-gradient(#fde68a, #f59e0b, #fff7cc, #b45309, #fde68a, #f59e0b, #fff7cc, #b45309, #fde68a);
    box-shadow: 0 0 44px rgba(253, 224, 71, 0.65), 0 18px 34px rgba(74, 0, 0, 0.55);
    animation: champ-spin 12s linear infinite;
}
.champ-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    object-fit: cover;
    border: 5px solid #ffffff;
}
.champ-crown {
    position: absolute;
    top: -46px;
    left: 50%;
    z-index: 1;
    width: 56px;
    height: 56px;
    margin-left: -28px;
    color: #fde047;
    filter: drop-shadow(0 3px 5px rgba(74, 0, 0, 0.6));
    transform: rotate(-4deg);
}
.champ-score {
    position: absolute;
    bottom: -24px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
    white-space: nowrap;
    border-radius: 9999px;
    padding: 2px 20px;
    font-size: 34px;
    font-weight: 900;
    color: #5c0000;
    background: linear-gradient(180deg, #fde68a, #f59e0b);
    box-shadow: 0 6px 16px rgba(74, 0, 0, 0.5);
}
.champ-score small {
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.06em;
}
.champ-divider {
    flex-shrink: 0;
    width: 75%;
    height: 2px;
    margin: 10px 0;
    background: linear-gradient(90deg, transparent, #fde047, transparent);
}
.champ-title {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 0.03em;
    color: #fde68a;
}
.champ-spark {
    position: absolute;
    color: #fde68a;
    animation: champ-twinkle 2.6s ease-in-out infinite;
}
.champ-spark--1 { top: 96px; left: 44px; font-size: 26px; }
.champ-spark--2 { top: 170px; right: 36px; font-size: 34px; animation-delay: 0.5s; }
.champ-spark--3 { top: 300px; left: 30px; font-size: 20px; animation-delay: 1s; }
.champ-spark--4 { top: 92px; right: 76px; font-size: 18px; animation-delay: 1.4s; }
.champ-spark--5 { top: 345px; right: 46px; font-size: 24px; animation-delay: 1.9s; }
.champ-spark--6 { top: 205px; left: 60px; font-size: 16px; animation-delay: 2.2s; }
@keyframes champ-enter {
    from { transform: perspective(1200px) rotateY(-60deg) scale(0.92); opacity: 0; }
    to { transform: none; opacity: 1; }
}
@keyframes champ-pop {
    from { transform: scale(0.4); opacity: 0; }
    to { transform: none; opacity: 1; }
}
@keyframes champ-shine {
    0%, 70% { transform: translateX(-120%); }
    100% { transform: translateX(120%); }
}
@keyframes champ-spin {
    to { transform: rotate(360deg); }
}
@keyframes champ-twinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.15); }
}
.chase-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 4px 0 10px;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.3em;
    color: #e80000;
}
.chase-divider::before,
.chase-divider::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(248, 0, 0, 0.45), transparent);
}
.tv-list {
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 88%, transparent);
}
.tv-list-inner {
    will-change: transform;
}
</style>
