<template>
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <HeroBackground />

        <div class="py-6">
            <h1 class="text-2xl font-bold text-highlighted">Close Periode</h1>
            <p class="text-sm text-gray-500">
                Periode komisi 26–25. Tanpa close manual, periode sebelumnya masih di-sync ulang dari NIS sampai akhir bulan, lalu berhenti otomatis.
                Periode yang di-close tidak di-sync ulang (otomatis maupun manual) dan datanya tidak bisa diedit dari halaman Invoice, sampai dibuka lagi.
            </p>
        </div>

        <UCard>
            <UTable :data="periods" :columns="columns" :loading="loading" />
            <template v-if="!loading && !canClose" #footer>
                <p class="text-xs text-gray-500">Hanya user tertentu yang bisa close / buka periode.</p>
            </template>
        </UCard>

        <UModal v-model:open="confirmOpen" :title="confirmTitle" :description="confirmDescription">
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <UButton label="Batal" color="neutral" variant="subtle" @click="confirmOpen = false" />
                    <UButton :label="pending?.action === 'close' ? 'Close periode' : 'Buka periode'" :color="pending?.action === 'close' ? 'error' : 'primary'" :loading="saving" @click="submit" />
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { PeriodService } from '~/services/period-service'
import type { PeriodClosure } from '~/types/period'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

interface PeriodRow {
    year: number
    month: number
    label: string
    range: string
    state: 'running' | 'syncing' | 'ended' | 'closed'
    closure?: PeriodClosure
}

const periodService = new PeriodService()
const toast = useToast()

const closures = ref<PeriodClosure[]>([])
const canClose = ref(false)
const loading = ref(false)
const saving = ref(false)
const confirmOpen = ref(false)
const pending = ref<{ action: 'close' | 'reopen'; row: PeriodRow }>()

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const monthName = (month: number) => new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, month - 1, 1))
const shortDate = (d: Date) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
const formatDateTime = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

// 12 periode terakhir, terbaru di atas. Periode (year, month) = 26 bulan sebelumnya s.d. 25 bulan itu.
const periods = computed<PeriodRow[]>(() => {
    const today = new Date()
    const todayIso = toIso(today)
    const current = new Date(today.getFullYear(), today.getMonth() + (today.getDate() > 25 ? 1 : 0), 1)

    return Array.from({ length: 12 }, (_, i) => {
        const anchor = new Date(current.getFullYear(), current.getMonth() - i, 1)
        const year = anchor.getFullYear()
        const month = anchor.getMonth() + 1
        const start = new Date(year, month - 2, 26)
        const end = new Date(year, month - 1, 25)
        const closure = closures.value.find(c => c.year === year && c.month === month)

        let state: PeriodRow['state']
        if (closure) state = 'closed'
        else if (toIso(end) >= todayIso) state = 'running'
        // Tanggal 26-akhir bulan: periode sebelumnya masih di-sync ulang oleh job
        else if (i === 1 && today.getDate() > 25) state = 'syncing'
        else state = 'ended'

        return { year, month, label: `${monthName(month)} ${year}`, range: `${shortDate(start)} – ${shortDate(end)}`, state, closure }
    })
})

const stateBadge: Record<PeriodRow['state'], { label: string; color: string }> = {
    running: { label: 'Berjalan', color: 'info' },
    syncing: { label: 'Masih di-sync s.d. akhir bulan', color: 'warning' },
    ended: { label: 'Selesai (tidak di-sync lagi)', color: 'neutral' },
    closed: { label: 'Closed', color: 'error' }
}

const columns: TableColumn<PeriodRow>[] = [
    {
        id: 'period',
        header: 'Periode',
        cell: ({ row }) => h('div', { class: 'leading-tight' }, [
            h('div', { class: 'font-medium' }, row.original.label),
            h('div', { class: 'text-xs text-gray-500' }, row.original.range)
        ])
    },
    {
        id: 'state',
        header: 'Status',
        cell: ({ row }) => {
            const badge = stateBadge[row.original.state]
            return h(UBadge, { label: badge.label, color: badge.color, variant: 'subtle' })
        }
    },
    {
        id: 'closedBy',
        header: 'Di-close oleh',
        cell: ({ row }) => {
            const closure = row.original.closure
            if (!closure) return '-'
            return h('div', { class: 'leading-tight' }, [
                h('div', closure.closed_by),
                h('div', { class: 'text-xs text-gray-500' }, formatDateTime(closure.closed_at))
            ])
        }
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            if (!canClose.value || row.original.state === 'running') return null
            const isClosed = row.original.state === 'closed'
            return h('div', { class: 'flex justify-end' }, [
                h(UButton, {
                    label: isClosed ? 'Buka' : 'Close',
                    icon: isClosed ? 'i-lucide-lock-open' : 'i-lucide-lock',
                    color: isClosed ? 'neutral' : 'error',
                    variant: 'subtle',
                    size: 'sm',
                    onClick: () => {
                        pending.value = { action: isClosed ? 'reopen' : 'close', row: row.original }
                        confirmOpen.value = true
                    }
                })
            ])
        }
    }
]

const confirmTitle = computed(() => pending.value
    ? `${pending.value.action === 'close' ? 'Close' : 'Buka'} periode ${pending.value.row.label}?`
    : '')
const confirmDescription = computed(() => pending.value?.action === 'close'
    ? 'Data periode ini tidak akan di-sync ulang dari NIS dan tidak bisa diedit dari halaman Invoice sampai dibuka lagi.'
    : 'Data periode ini bisa diedit lagi dari halaman Invoice dan bisa di-sync ulang manual. Sync otomatis hanya mengulang periode sebelumnya sampai akhir bulan.')

const fetchClosures = async () => {
    loading.value = true
    try {
        const response = await periodService.getClosures()
        closures.value = response.data.closures
        canClose.value = response.data.canClose
    } finally {
        loading.value = false
    }
}

const submit = async () => {
    if (!pending.value) return
    const { action, row } = pending.value
    saving.value = true
    try {
        if (action === 'close') await periodService.closePeriod(row.year, row.month)
        else await periodService.reopenPeriod(row.year, row.month)
        toast.add({ title: action === 'close' ? `Periode ${row.label} di-close` : `Periode ${row.label} dibuka`, color: 'success' })
        confirmOpen.value = false
        await fetchClosures()
    } finally {
        saving.value = false
    }
}

onMounted(fetchClosures)
</script>
