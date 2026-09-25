<template>
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <HeroBackground />

        <div class="py-6">
            <h1 class="text-2xl font-bold text-highlighted">Invoice Snapshots</h1>
            <p class="text-sm text-gray-500">Daftar seluruh invoice snapshot — cari & filter berdasarkan status dan type</p>
        </div>

        <UCard :ui="{ root: 'w-full' }">
            <template #header>
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <UInput
                        v-model="search"
                        icon="i-lucide-search"
                        placeholder="Cari customer, invoice, atau service…"
                        class="w-full lg:max-w-xs"
                        :ui="{ trailing: 'pe-1' }"
                    >
                        <template v-if="search" #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                icon="i-lucide-x"
                                aria-label="Clear"
                                @click="search = '';"
                            />
                        </template>
                    </UInput>

                    <div class="flex flex-wrap items-center gap-2">
                        <USelect
                            v-model="month"
                            :items="monthOptions"
                            placeholder="Bulan"
                            class="w-36"
                        />
                        <USelect
                            v-model="year"
                            :items="yearOptions"
                            placeholder="Tahun"
                            class="w-28"
                        />
                        <USelect
                            v-model="status"
                            :items="statusOptions"
                            placeholder="Status"
                            class="w-36"
                        />
                        <USelect
                            v-model="type"
                            :items="typeOptions"
                            placeholder="Type"
                            class="w-36"
                        />
                        <USelect
                            v-model="salesId"
                            :items="accountManagerOptions"
                            placeholder="Account Manager"
                            class="w-48"
                        />
                    </div>
                </div>
            </template>

            <UTable
                sticky
                :data="items"
                :columns="columns"
                :loading="loading"
                class="flex-1 max-h-[800px]"
            />

            <template #footer>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <p class="text-sm text-gray-500">
                            Menampilkan {{ items.length }} dari {{ meta.total }} data
                        </p>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Rows</span>
                            <USelect
                                v-model="limit"
                                :items="limitOptions"
                                class="w-20"
                            />
                        </div>
                    </div>
                    <UPagination
                        v-model:page="page"
                        :items-per-page="meta.limit"
                        :total="meta.total"
                    />
                </div>
            </template>
        </UCard>

        <UModal v-model:open="editModalOpen" :ui="{ overlay: 'bg-white/45 dark:bg-black/45 backdrop-blur-xs' }">
            <template #content>
                <div class="p-5">
                    <div class="space-y-1 mb-4">
                        <h3 class="text-lg font-semibold">Edit Snapshot</h3>
                        <p class="text-sm text-gray-500">AI: {{ editingItem?.ai }} — {{ editingItem?.customerCompany }}</p>
                    </div>

                    <div class="space-y-4">
                        <UFormField label="Status">
                            <USelect v-model="editForm.status" :items="editStatusOptions" class="w-full" />
                        </UFormField>
                        <UFormField label="Subscription">
                            <UInput v-model.number="editForm.subscription" type="number" class="w-full" />
                        </UFormField>
                        <UFormField label="Month Period">
                            <UInput v-model.number="editForm.month_period" type="number" step="0.01" class="w-full" />
                        </UFormField>
                        <UFormField label="Total Account">
                            <UInput v-model.number="editForm.total_account" type="number" class="w-full" />
                        </UFormField>
                        <UFormField v-if="editingItem?.serviceType === 'resell'" label="Modal">
                            <UInput v-model.number="editForm.modal" type="number" class="w-full" />
                        </UFormField>
                        <UFormField v-if="editingItem?.serviceType === 'internal'" label="Cross Sell Count">
                            <UInput v-model.number="editForm.cross_sell_count" type="number" class="w-full" />
                        </UFormField>
                        <UFormField label="Base Komisi" description="Kosongkan untuk pakai nilai Subscription sebagai basis komisi (default). Cuma memengaruhi nominal komisi, tidak mempengaruhi MRC/Subscription/Margin.">
                            <UInput v-model.number="editForm.base_commission" type="number" placeholder="Kosongkan = pakai Subscription" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <UButton label="Cancel" color="neutral" variant="subtle" :disabled="saving" @click="editModalOpen = false" />
                        <UButton label="Save" color="primary" variant="solid" :loading="saving" @click="submitEdit" />
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { InvoiceService } from '~/services/invoice-service'
import { AdditionalService } from '~/services/additional-service'
import type { SnapshotItem, SnapshotListMeta, SnapshotUpdatePayload } from '~/types/snapshot'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')

const invoiceService = new InvoiceService()

const items = ref<SnapshotItem[]>([])
const meta = ref<SnapshotListMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 })
const loading = ref(false)

const now = new Date()
const search = ref('')
const status = ref('all')
const type = ref('all')
const salesId = ref('all')
const month = ref<number>(now.getMonth() + 1)
const year = ref<number>(now.getFullYear())
const limit = ref<number>(10)
const page = ref(1)
const ready = ref(false)

const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Upgrade', value: 'upgrade' },
    { label: 'Prorate', value: 'prorate' },
    { label: 'Termin', value: 'termin' },
    { label: 'Recurring', value: 'recurring' },
    { label: 'Add', value: 'add' },
    { label: 'Setup', value: 'setup' }
]

const editStatusOptions = [
    { label: 'New', value: 'new' },
    { label: 'Upgrade', value: 'upgrade' },
    { label: 'Prorate', value: 'prorate' },
    { label: 'Termin', value: 'termin' },
    { label: 'Recurring', value: 'recurring' },
    { label: 'Add', value: 'add' },
    { label: 'Setup', value: 'setup' }
]

const typeOptions = [
    { label: 'All Type', value: 'all' },
    { label: 'Internal', value: 'internal' },
    { label: 'Resell', value: 'resell' }
]

const monthOptions = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 }
]

const yearOptions = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
const limitOptions = [10, 25, 50, 100]

const accountManagerOptions = ref<{ label: string; value: string }[]>([
    { label: 'All Account Manager', value: 'all' }
])

const fetchAccountManagers = async () => {
    try {
        const response = await invoiceService.getAccountManagers()
        accountManagerOptions.value = [
            { label: 'All Account Manager', value: 'all' },
            ...response.data.map(am => ({ label: `${am.name} (${am.employeeId})`, value: am.employeeId }))
        ]
    } catch {
        // biarkan hanya opsi "All" jika gagal
    }
}

const typeBadge = (serviceType: string) => {
    return serviceType === 'resell'
        ? { color: 'secondary' as const, label: 'Resell' }
        : { color: 'primary' as const, label: 'Internal' }
}

const columns: TableColumn<SnapshotItem>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice Number',
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('a', {
                    href: `https://isx.nusa.net.id/customer.php?module=customer&pid=printNewCustomerInvoice&invoiceNum=${row.original.invoiceNumber}&urut=${row.original.sequenceNumber}&new=1&proforma=0&signature=0`,
                    target: '_blank',
                    class: ['text-info hover:underline font-bold']
                }, row.original.invoiceNumber),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.ai)
            ])
        }
    },
    {
        accessorKey: 'paidDate',
        header: 'Paid Date',
        cell: ({ row }) => {
            const value = row.getValue('paidDate') as string
            if (!value) return '-'
            return new Date(value).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        }
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const badge = getStatusBadge(row.original.status)
            return h(UBadge, { color: badge.color, variant: badge.variant }, () => badge.label)
        }
    },
    {
        id: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const badge = typeBadge(row.original.serviceType)
            return h(UBadge, { color: badge.color, variant: 'soft' }, () => badge.label)
        }
    },
    {
        header: 'Service',
        meta: { class: { th: 'min-w-[220px]', td: 'min-w-[220px]' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('a', {
                    href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                    target: '_blank',
                    class: ['text-info hover:underline font-semibold']
                }, row.original.customerServiceId),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.serviceName)
            ])
        }
    },
    {
        header: 'Customer',
        meta: { class: { th: 'min-w-[220px]', td: 'min-w-[220px]' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('a', {
                    href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                    target: '_blank',
                    class: ['text-info hover:underline font-semibold']
                }, row.original.customerId),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.customerCompany)
            ])
        }
    },
    {
        header: 'Account Manager',
        cell: ({ row }) => {
            const sales = row.original.sales
            if (!sales || !sales.employeeId) return '-'
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, { src: sales.photoProfile || undefined, size: 'lg' }),
                h('div', undefined, [
                    h('p', { class: 'font-medium text-highlighted' }, sales.name),
                    h('p', { class: '' }, sales.employeeId)
                ])
            ])
        }
    },
    {
        accessorKey: 'subscription',
        header: 'Subscription',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatCurrency(Number(row.getValue('subscription')) || 0)
    },
    {
        accessorKey: 'mrc',
        header: 'MRC',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatCurrency(Number(row.getValue('mrc')) || 0)
    },
    {
        header: 'Commission',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 2 }).format(row.original.commissionPercentage) + '%'),
                h('span', { class: 'text-sm' }, formatCurrency(row.original.commission))
            ])
        }
    },
    {
        id: 'isAdjust',
        header: 'Adjust',
        meta: { class: { th: 'text-center', td: 'text-center' } },
        cell: ({ row }) => {
            if (!row.original.isAdjust) return h('span', { class: 'text-gray-400' }, '-')
            return h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Adjusted')
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        meta: { class: { th: 'text-center', td: 'text-center' } },
        cell: ({ row }) => {
            return h(UButton, {
                icon: 'i-lucide-pencil',
                color: 'neutral',
                variant: 'ghost',
                size: 'sm',
                onClick: () => openEdit(row.original)
            })
        }
    }
]

const fetchSnapshots = async () => {
    loading.value = true
    try {
        const response = await invoiceService.getSnapshotList({
            search: search.value || undefined,
            status: status.value !== 'all' ? status.value : undefined,
            type: type.value !== 'all' ? type.value : undefined,
            salesId: salesId.value !== 'all' ? salesId.value : undefined,
            month: month.value,
            year: year.value,
            page: page.value,
            limit: limit.value
        })
        items.value = response.data.items
        meta.value = response.data.meta
    } finally {
        loading.value = false
    }
}

// Filter berubah → kembali ke page 1 lalu fetch (hindari double-fetch)
const resetAndFetch = () => {
    if (page.value !== 1) {
        page.value = 1
    } else {
        fetchSnapshots()
    }
}

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { if (ready.value) resetAndFetch() }, 400)
})

watch([status, type, salesId, month, year, limit], () => {
    if (ready.value) resetAndFetch()
})
watch(page, () => {
    if (ready.value) fetchSnapshots()
})

onMounted(async () => {
    // Set default bulan/tahun ke periode berjalan (cut-off 26-25) dari backend
    // + ambil daftar Account Manager untuk dropdown filter
    try {
        const additionalService = new AdditionalService()
        const [periodRes] = await Promise.all([
            additionalService.getCurrentPeriod(),
            fetchAccountManagers()
        ])
        if (periodRes?.data) {
            month.value = periodRes.data.month
            year.value = periodRes.data.year
        }
    } catch {
        // fallback: tetap pakai bulan/tahun kalender saat ini
    }

    await fetchSnapshots()
    ready.value = true
})

const toast = useToast()

const editModalOpen = ref(false)
const editingItem = ref<SnapshotItem | null>(null)
const saving = ref(false)
const editForm = ref<SnapshotUpdatePayload>({})

const openEdit = (item: SnapshotItem) => {
    editingItem.value = item
    editForm.value = {
        status: item.status,
        subscription: item.subscription,
        month_period: Number(item.monthPeriod),
        total_account: item.totalAccount,
        modal: item.modal ?? undefined,
        cross_sell_count: item.crossSellCount ?? undefined,
        base_commission: item.baseCommission ?? undefined
    }
    editModalOpen.value = true
}

const submitEdit = async () => {
    if (!editingItem.value) return
    saving.value = true
    try {
        await invoiceService.updateSnapshot(editingItem.value.ai, editForm.value)
        toast.add({ title: 'Snapshot updated successfully', color: 'success' })
        editModalOpen.value = false
        await fetchSnapshots()
    } finally {
        saving.value = false
    }
}
</script>
