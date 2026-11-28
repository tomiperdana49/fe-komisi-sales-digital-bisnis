<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            v-model:month="month"
            mode="monthly"
            subtitle="Monthly sales commission heatmap 🔥"
        />

        <div class="py-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Col 1: Commission + Subscription -->
                <div class="flex flex-col gap-4">
                    <MetricCard
                        label="Total Commission"
                        icon="i-lucide-wallet"
                        icon-color="text-info dark:text-blue-400"
                        :data="commissionData?.commission?.total"
                        :is-currency="true"
                        :large="true"
                    >
                        <div v-if="commissionData?.commission" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">New</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.commission.new?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.commission.new"
                                        :color="trendColor(commissionData.commission.new.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.commission.new.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Recurring</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.commission.recurring?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.commission.recurring"
                                        :color="trendColor(commissionData.commission.recurring.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.commission.recurring.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                            <div v-if="hasReferral" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Referral</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.commission.referral?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.commission.referral"
                                        :color="trendColor(commissionData.commission.referral.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.commission.referral.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                            <QuarterRewardRow v-if="commissionData.reward" :reward="commissionData.reward" />
                        </div>
                    </MetricCard>
                    <MetricCard
                        label="Total Subscription"
                        icon="i-lucide-coins"
                        icon-color="text-purple-500 dark:text-purple-400"
                        :data="commissionData?.subscription?.total"
                        :is-currency="true"
                    >
                        <div v-if="commissionData?.subscription" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">New</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.subscription.new?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.subscription.new"
                                        :color="trendColor(commissionData.subscription.new.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.subscription.new.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Recurring</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.subscription.recurring?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.subscription.recurring"
                                        :color="trendColor(commissionData.subscription.recurring.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.subscription.recurring.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </MetricCard>
                </div>

                <!-- Col 2: sisanya -->
                <div class="flex flex-col gap-4">
                    <MetricCard
                        label="New Customer"
                        icon="i-lucide-user-plus"
                        icon-color="text-amber-500 dark:text-amber-400"
                        :data="commissionData?.newCustomer"
                    />
                    <MetricCard
                        label="New Account"
                        icon="i-lucide-users"
                        icon-color="text-cyan-500 dark:text-cyan-400"
                        :data="commissionData?.newAccount"
                    />
                    <MetricCard
                        label="Total MRC"
                        icon="i-lucide-trending-up"
                        icon-color="text-emerald-500 dark:text-emerald-400"
                        :data="commissionData?.mrc"
                        :is-currency="true"
                    >
                        <div v-if="commissionData?.mrcChurn" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">MRC Churn</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.mrcChurn.value || 0) }}</span>
                                    <!-- churn naik = buruk, warna dibalik -->
                                    <UBadge
                                        :color="trendColor(commissionData.mrcChurn.trend === 'up' ? 'down' : 'up')"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.mrcChurn.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                            <div v-if="commissionData.mrcNet" class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Net MRC</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.mrcNet.value || 0) }}</span>
                                    <UBadge
                                        :color="trendColor(commissionData.mrcNet.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.mrcNet.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </MetricCard>
                </div>
            </div>
        </div>

        <div class="py-2 mt-4">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-lg font-semibold">Invoice</h3>
                            <p class="text-sm text-gray-500">Monthly invoice details</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <UInput v-model="invoiceSearch" icon="i-lucide-search" variant="outline" placeholder="Search invoice, customer, service..." class="w-full sm:w-72" />
                            <USelect v-model="statusFilter" :items="statusOptions" multiple placeholder="All Status" class="w-48 shrink-0" />
                        </div>
                    </div>
                </template>
                <UTabs :items="tabItems" v-model="activeTab" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
                    <template #internal>
                        <div class="mt-4">
                            <UTable sticky :data="filteredInvoiceData" :columns="columns" class="flex-1 max-h-[800px]" />
                        </div>
                    </template>
                    <template #resell>
                        <div class="mt-4">
                            <UAlert
                                v-if="resellWarningCount > 0"
                                color="warning"
                                variant="soft"
                                icon="i-lucide-triangle-alert"
                                title="Perhatian"
                                :description="`${resellWarningCount} invoice tidak memiliki modal (Rp.0). Komisi dihitung dengan default margin terkecil (2.5%).`"
                                class="mb-4"
                            />
                            <div class="resell-table">
                                <UTable sticky :data="filteredResellData" :columns="resellColumns" class="flex-1 max-h-[800px]" />
                            </div>
                        </div>
                    </template>
                    <template #churn>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 mb-4">
                                Layanan yang berhenti (unreg) di periode ini. Total MRC hilang:
                                <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(filteredChurnMrc) }}</span>
                                ({{ filteredChurnData.length }} layanan). Filter status tidak berlaku di tab ini.
                            </p>
                            <UTable sticky :data="filteredChurnData" :columns="churnColumns" :loading="churnLoading" class="flex-1 max-h-[800px]" />
                        </div>
                    </template>
                    <template #referral>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 mb-4">
                                Komisi Referral Internal sebagai pemberi lead: 10% × new MRC produk internal, 1% produk resell,
                                sekali di periode Paid Date. Total:
                                <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(filteredReferralCommission) }}</span>
                                ({{ filteredReferralData.length }} invoice). Filter status tidak berlaku di tab ini.
                            </p>
                            <UTable sticky :data="filteredReferralData" :columns="referralColumns" :loading="referralLoading" class="flex-1 max-h-[800px]" />
                        </div>
                    </template>
                </UTabs>
            </UCard>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { AdditionalService } from '~/services/additional-service'
import { EmployeeService } from '~/services/employee-service'
import { InvoiceService } from '~/services/invoice-service'
import { CommissionService } from '~/services/commission-service'
import type { Employee } from '~/types/employee'
import { h, resolveComponent, type VNodeChild } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { InvoiceSalesInternalData, InvoiceSalesResellData, SalesCommissionData, SalesChurnData, ReferralDeal } from '~/types/sales'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')
const ClientOnly = resolveComponent('ClientOnly')

const invoiceData = ref<InvoiceSalesInternalData[]>([])
const resellData = ref<InvoiceSalesResellData[]>([])
const churnData = ref<SalesChurnData[]>([])
const churnLoading = ref(false)
const churnLoaded = ref(false)
const commissionData = ref<SalesCommissionData>()

const { statusFilter, statusOptions, matchesStatus } = useStatusFilter([
    { label: 'New', value: 'new' },
    { label: 'Upgrade', value: 'upgrade' },
    { label: 'Prorate', value: 'prorate' },
    { label: 'Termin', value: 'termin' },
    { label: 'Recurring', value: 'recurring' },
    { label: 'Add', value: 'add' }
])

const invoiceSearch = ref('')

// Cocokkan filter status + kata kunci (no. invoice, AI, customer, layanan); pencarian di data yang sudah dimuat
const matchesInvoiceFilter = (row: InvoiceSalesInternalData | InvoiceSalesResellData) => {
    if (!matchesStatus(row.status)) return false
    const q = invoiceSearch.value.trim().toLowerCase()
    if (!q) return true
    return [row.invoiceNumber, row.ai, row.customerId, row.customerCompany, row.customerServiceId, row.serviceId, row.serviceName]
        .some(value => value != null && String(value).toLowerCase().includes(q))
}

const filteredInvoiceData = computed(() => invoiceData.value.filter(matchesInvoiceFilter))

const filteredResellData = computed(() => resellData.value.filter(matchesInvoiceFilter))

// Churn: hanya kata kunci (tidak ada status invoice)
const filteredChurnData = computed(() => {
    const q = invoiceSearch.value.trim().toLowerCase()
    if (!q) return churnData.value
    return churnData.value.filter(row =>
        [row.customerId, row.customerCompany, row.customerServiceId, row.serviceId, row.serviceName, row.closeReason]
            .some(value => value != null && String(value).toLowerCase().includes(q))
    )
})
const filteredChurnMrc = computed(() => filteredChurnData.value.reduce((sum, row) => sum + (Number(row.mrc) || 0), 0))

// Referral (pemberi lead): baris di kartu & tab hanya muncul kalau periode ini atau bulan lalu ada komisinya
const referralData = ref<ReferralDeal[]>([])
const referralLoading = ref(false)
const referralLoaded = ref(false)
const hasReferral = computed(() => {
    const referral = commissionData.value?.commission?.referral
    return !!referral && (referral.value !== 0 || referral.growth !== 0)
})

const filteredReferralData = computed(() => {
    const q = invoiceSearch.value.trim().toLowerCase()
    if (!q) return referralData.value
    return referralData.value.filter(row =>
        [row.invoiceNo, row.ai, row.customerId, row.customerName, row.productName, row.sellerName]
            .some(value => value != null && String(value).toLowerCase().includes(q))
    )
})
const filteredReferralCommission = computed(() => filteredReferralData.value.reduce((sum, row) => sum + (Number(row.commission) || 0), 0))

const tabItems = computed(() => [
    { label: 'Internal', slot: 'internal', value: 'internal' },
    { label: 'Resell', slot: 'resell', value: 'resell' },
    { label: 'Churn', slot: 'churn', value: 'churn' },
    ...(hasReferral.value ? [{ label: 'Referral', slot: 'referral', value: 'referral' }] : [])
])
const activeTab = ref('internal')

// Tab referral hilang saat pindah ke periode tanpa referral -> kembali ke Internal
watch(hasReferral, (value) => {
    if (!value && activeTab.value === 'referral') activeTab.value = 'internal'
})

const referralColumns: TableColumn<ReferralDeal>[] = [
    {
        accessorKey: 'invoiceNo',
        header: 'Invoice Number',
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-bold text-highlighted' }, row.original.invoiceNo ?? '-'),
            h('span', { class: 'text-sm' }, row.original.ai)
        ])
    },
    {
        accessorKey: 'paidDate',
        header: 'Paid Date',
        cell: ({ row }) => row.original.paidDate
            ? new Date(row.original.paidDate).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-'
    },
    {
        header: 'Customer',
        meta: { class: { th: 'min-w-[200px]', td: 'min-w-[200px]' } },
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-semibold' }, row.original.customerId ?? '-'),
            h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.customerName ?? '')
        ])
    },
    {
        header: 'Service',
        meta: { class: { th: 'min-w-[200px]', td: 'min-w-[200px]' } },
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.productName ?? '-'),
            h('span', { class: 'text-xs text-gray-500' }, row.original.productLine === 'resell' ? 'Resell' : 'Internal')
        ])
    },
    {
        header: 'Penerima Lead',
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-medium text-highlighted' }, row.original.sellerName ?? '-'),
            h('span', { class: 'text-sm' }, row.original.sellerEmployeeId ?? '')
        ])
    },
    {
        header: 'Catatan',
        meta: { class: { th: 'min-w-[180px]', td: 'min-w-[180px]' } },
        cell: ({ row }) => h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.note ?? '-')
    },
    {
        accessorKey: 'mrc',
        header: 'New MRC',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatCurrency(Number(row.original.mrc) || 0)
    },
    {
        header: 'Commission',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => {
            if (!row.original.eligible) {
                return h('span', { class: 'text-xs text-warning' }, 'Tidak dihitung (bukan invoice New)')
            }
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, `${row.original.commissionPercentage}%`),
                h('span', { class: 'text-sm' }, formatCurrency(row.original.commission))
            ])
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.commission) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    }
]

const resellWarningCount = computed(() => {
    return resellData.value.filter(row => row.status !== 'recurring' && row.status !== 'add' && !row.modal).length
})

// Tooltip "cara hitung" di sel tabel; rumusnya dari utils/invoice-calculation.ts
const withCalculation = (content: VNodeChild, lines: string[]) =>
    h(UTooltip, { content: { side: 'top' } }, {
        default: () => h('div', { class: 'cursor-help underline decoration-dotted decoration-muted underline-offset-4' }, [content]),
        content: () => h('div', { class: 'max-w-xs space-y-1 text-xs whitespace-normal text-left' }, lines.map(line => h('p', line)))
    })

const columns: TableColumn<InvoiceSalesInternalData>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice Number',
        cell: ({ row }) => {
            const invoiceNum = row.original.invoiceNumber
            return h('div', { class: 'flex flex-col' }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/customer.php?module=customer&pid=printNewCustomerInvoice&invoiceNum=${invoiceNum}&urut=${row.original.sequenceNumber}&new=1&proforma=0&signature=0`,
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
            return new Date(row.getValue('paidDate')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
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
        header: 'Service',
        meta: {
            class: {
                th: 'min-w-[250px]',
                td: 'min-w-[250px]'
            }
        },
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
        meta: {
            class: {
                th: 'min-w-[250px]',
                td: 'min-w-[250px]'
            }
        },
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
        header: 'Implementator',
        cell: ({ row }) => {
            const implementator = row.original.implementator
            if (!implementator || !implementator.employeeId) {
                return '-'
            }
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, {
                    src: implementator.photoProfile || undefined,
                    size: 'lg'
                }),
                h('div', undefined, [
                    h('p', { class: 'font-medium text-highlighted' }, implementator.name),
                    h('p', { class: '' }, implementator.employeeId)
                ])
            ])
        }
    },
    {
        accessorKey: 'subscription',
        header: 'Subscription',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('subscription'))
            return withCalculation(formatCurrency(amount), subscriptionCalculation(row.original))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.subscription) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        accessorKey: 'mrc',
        header: 'MRC',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('mrc'))
            return withCalculation(formatCurrency(amount), mrcCalculation(row.original, 'internal'))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.mrc) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'Month Period',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const period = parseFloat(row.original.monthPeriod)
            if (isNaN(period)) return '-'
            const truncated = Math.trunc(period * 100) / 100
            const value = parseFloat(truncated.toFixed(2))
            const summary = row.original.monthPeriodSummary
            return withCalculation(h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, value),
                h('span', { class: 'text-sm' }, summary)
            ]), monthPeriodCalculation(row.original))
        }
    },
    {
        header: 'Total Account',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center font-medium'
            }
        },
        cell: ({ row }) => {
            return row.original.totalAccount
        }
    },
    {
        header: 'Commission',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            return withCalculation(h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.commissionPercentage) + '%'),
                h('span', { class: 'text-sm' }, formatCurrency(row.original.commission))
            ]), commissionCalculation(row.original, 'internal'))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.commission) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    }
]

const resellColumns: TableColumn<InvoiceSalesResellData>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice Number',
        cell: ({ row }) => {
            const invoiceNum = row.original.invoiceNumber
            const isWarning = row.original.status !== 'recurring' && row.original.status !== 'add' && !row.original.modal
            return h('div', { class: ['flex flex-col', isWarning ? 'resell-warning-marker' : ''] }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/customer.php?module=customer&pid=printNewCustomerInvoice&invoiceNum=${invoiceNum}&urut=${row.original.sequenceNumber}&new=1&proforma=0&signature=0`,
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
            return new Date(row.getValue('paidDate')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
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
        header: 'Service',
        meta: {
            class: {
                th: 'min-w-[250px]',
                td: 'min-w-[250px]'
            }
        },
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
        meta: {
            class: {
                th: 'min-w-[250px]',
                td: 'min-w-[250px]'
            }
        },
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
        accessorKey: 'subscription',
        header: 'Subscription',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('subscription'))
            return withCalculation(formatCurrency(amount), subscriptionCalculation(row.original))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.subscription) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        accessorKey: 'mrc',
        header: 'MRC',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('mrc'))
            return withCalculation(formatCurrency(amount), mrcCalculation(row.original, 'resell'))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.mrc) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        accessorKey: 'modal',
        header: 'Modal',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            if (row.original.status === 'recurring' || row.original.status === 'add') return '-'
            return formatCurrency(Number(row.getValue('modal')))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.modal) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        accessorKey: 'price',
        header: 'Price',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            if (row.original.status === 'recurring' || row.original.status === 'add') return '-'
            return formatCurrency(Number(row.getValue('price')))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.price) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'Margin',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            if (row.original.status === 'recurring' || row.original.status === 'add') return '-'
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 2 }).format(row.original.margin) + '%'),
                h('span', { class: 'text-sm' }, formatCurrency(row.original.markup))
            ])
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.markup) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'Month Period',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            const period = parseFloat(row.original.monthPeriod)
            if (isNaN(period)) return '-'
            const truncated = Math.trunc(period * 100) / 100
            const value = parseFloat(truncated.toFixed(2))
            const summary = row.original.monthPeriodSummary
            return withCalculation(h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, value),
                h('span', { class: 'text-sm' }, summary)
            ]), monthPeriodCalculation(row.original))
        }
    },
    {
        header: 'Total Account',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center font-medium'
            }
        },
        cell: ({ row }) => {
            return row.original.totalAccount
        }
    },
    {
        header: 'Commission',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            return withCalculation(h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.commissionPercentage) + '%'),
                h('span', { class: 'text-sm' }, formatCurrency(row.original.commission))
            ]), commissionCalculation(row.original, 'resell'))
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.commission) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    }
]

const churnColumns = buildChurnColumns()

const route = useRoute()
const employee = ref<Employee>()  

const year = ref<number>()
const month = ref<number>()

const fetchData = async () => {
    const additionalService = new AdditionalService()
    await additionalService.getCurrentPeriod()
    const employeeService = new EmployeeService()
    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data
}

const fetchInvoiceData = async () => {
    if (!year.value || !month.value) return
    const invoiceService = new InvoiceService()
    const response = await invoiceService.getInvoiceInternal(route.params.id as string, {month: month.value, year: year.value})
    invoiceData.value = response.data

    const commissionService = new CommissionService()
    const commissionResponse = await commissionService.salesCommission(route.params.id as string, {month: month.value, year: year.value})
    if (commissionResponse?.data) {
        commissionData.value = commissionResponse.data
    }
}

const fetchResellData = async () => {
    if (!year.value || !month.value) return
    const invoiceService = new InvoiceService()
    const response = await invoiceService.getInvoiceResell(route.params.id as string, {month: month.value, year: year.value})
    resellData.value = response.data
}

const fetchChurnData = async () => {
    if (!year.value || !month.value) return
    churnLoading.value = true
    try {
        const invoiceService = new InvoiceService()
        const response = await invoiceService.getSalesChurn(route.params.id as string, { month: month.value, year: year.value })
        churnData.value = response.data
        churnLoaded.value = true
    } finally {
        churnLoading.value = false
    }
}

const fetchReferralData = async () => {
    if (!year.value || !month.value) return
    referralLoading.value = true
    try {
        const invoiceService = new InvoiceService()
        const response = await invoiceService.getReferralInvoice(route.params.id as string, { month: month.value, year: year.value })
        referralData.value = response.data.deals
        referralLoaded.value = true
    } finally {
        referralLoading.value = false
    }
}

watch([year, month], () => {
    fetchInvoiceData()
    churnLoaded.value = false
    referralLoaded.value = false
    if (activeTab.value === 'resell') {
        fetchResellData()
    }
    if (activeTab.value === 'churn') {
        fetchChurnData()
    }
    if (activeTab.value === 'referral') {
        fetchReferralData()
    }
})

watch(activeTab, (tab) => {
    if (tab === 'resell' && resellData.value.length === 0 && year.value && month.value) {
        fetchResellData()
    }
    if (tab === 'churn' && !churnLoaded.value) {
        fetchChurnData()
    }
    if (tab === 'referral' && !referralLoaded.value) {
        fetchReferralData()
    }
})

fetchData()
</script>

<style>
.resell-table tr:has(.resell-warning-marker) td {
    background-color: #fefce8 !important;
}

html.dark .resell-table tr:has(.resell-warning-marker) td {
    background-color: rgba(113, 63, 18, 0.2) !important;
}
</style>
