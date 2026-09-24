<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            v-model:month="month"
            mode="monthly"
            route-prefix="manager"
            subtitle="Monthly manager commission heatmap 🔥"
        />

        <div class="py-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Col 1: Manager Commission + Subscription -->
                <div class="flex flex-col gap-4">
                    <MetricCard
                        label="Manager Commission"
                        icon="i-lucide-wallet"
                        icon-color="text-info dark:text-blue-400"
                        :data="commissionData?.managerCommission"
                        :is-currency="true"
                        :large="true"
                    >
                        <div v-if="commissionData?.commission" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Total Commission</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.commission.total?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.commission.total"
                                        :color="trendColor(commissionData.commission.total.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.commission.total.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
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
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Cust Lama</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.commission.custLama?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.commission.custLama"
                                        :color="trendColor(commissionData.commission.custLama.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.commission.custLama.percentage) }}
                                    </UBadge>
                                </div>
                            </div>
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
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">Cust Lama</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(commissionData.subscription.custLama?.value || 0) }}</span>
                                    <UBadge
                                        v-if="commissionData.subscription.custLama"
                                        :color="trendColor(commissionData.subscription.custLama.trend)"
                                        variant="soft"
                                        size="sm"
                                    >
                                        {{ formatPercentage(commissionData.subscription.custLama.percentage) }}
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
                    />
                </div>
            </div>
        </div>

        <div class="py-2 mt-4">
            <UCard>
                <template #header>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Team</h3>
                    <p class="text-sm text-gray-500">Monthly team performance</p>
                </template>
                <UTable sticky :data="teamData" :columns="teamColumns" class="flex-1 max-h-[800px]" @select="onSelectTeamMember" :ui="{ tr: 'cursor-pointer' }" />
            </UCard>
        </div>

        <div class="py-2 mt-4">
            <UCard>
                <template #header>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Invoice</h3>
                    <p class="text-sm text-gray-500">Manager's own recurring invoices</p>
                </template>
                <UTabs :items="invoiceTabItems" v-model="activeInvoiceTab" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
                    <template #internal>
                        <div class="mt-4">
                            <UTable sticky :data="managerInternalData" :columns="managerInternalColumns" class="flex-1 max-h-[800px]" />
                        </div>
                    </template>
                    <template #resell>
                        <div class="mt-4">
                            <UTable sticky :data="managerResellData" :columns="managerResellColumns" class="flex-1 max-h-[800px]" />
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
import { TeamService } from '~/services/team-service'
import { CommissionService } from '~/services/commission-service'
import { InvoiceService } from '~/services/invoice-service'
import type { Employee } from '~/types/employee'
import type { ManagerTeamMemberData } from '~/types/team'
import type { ManagerCommissionData } from '~/types/manager'
import type { InvoiceSalesInternalData, InvoiceSalesResellData } from '~/types/sales'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const ClientOnly = resolveComponent('ClientOnly')

const route = useRoute()
const employee = ref<Employee>()

const year = ref<number>()
const month = ref<number>()

const teamData = ref<ManagerTeamMemberData[]>([])
const commissionData = ref<ManagerCommissionData>()

const managerInternalData = ref<InvoiceSalesInternalData[]>([])
const managerResellData = ref<InvoiceSalesResellData[]>([])

const invoiceTabItems = [
    { label: 'Internal', slot: 'internal', value: 'internal' },
    { label: 'Resell', slot: 'resell', value: 'resell' }
]
const activeInvoiceTab = ref('internal')

const teamColumns: TableColumn<ManagerTeamMemberData>[] = [
    {
        accessorKey: 'name',
        header: 'Sales',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, {
                    src: row.original.photoProfile || undefined,
                    size: 'lg'
                }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-medium text-highlighted' }, row.original.name),
                    h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, row.original.employeeId)
                ])
            ])
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
            return formatCurrency(row.original.detail.commission)
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.detail.commission) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'MRC',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            return formatCurrency(row.original.detail.mrc)
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.detail.mrc) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'Subscription',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
        },
        cell: ({ row }) => {
            return formatCurrency(row.original.detail.subscription)
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.detail.subscription) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    },
    {
        header: 'New Customer',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center font-medium'
            }
        },
        cell: ({ row }) => {
            return row.original.detail.newCustomer
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.detail.newCustomer) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-center font-bold' }, total),
                fallback: () => h('div', { class: 'text-center font-bold' }, 0)
            })
        }
    },
    {
        header: 'New Account',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center font-medium'
            }
        },
        cell: ({ row }) => {
            return row.original.detail.newAccount
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.detail.newAccount) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-center font-bold' }, total),
                fallback: () => h('div', { class: 'text-center font-bold' }, 0)
            })
        }
    },
    {
        header: 'Manager Commission',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right'
            }
        },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm font-bold text-highlighted' }, '25%'),
                h('span', { class: 'text-sm font-medium text-highlighted' }, formatCurrency(row.original.managerCommission))
            ])
        },
        footer: ({ table }) => {
            const rows = table.getFilteredRowModel().rows
            const total = rows.reduce((acc, row) => acc + (Number(row.original.managerCommission) || 0), 0)
            return h(ClientOnly, null, {
                default: () => h('div', { class: 'text-right font-bold' }, formatCurrency(total)),
                fallback: () => h('div', { class: 'text-right font-bold' }, formatCurrency(0))
            })
        }
    }
]

const managerInternalColumns: TableColumn<InvoiceSalesInternalData>[] = [
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
            return new Date(row.getValue('paidDate')).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
        header: 'Implementator',
        cell: ({ row }) => {
            const implementator = row.original.implementator
            if (!implementator || !implementator.employeeId) return '-'
            return h('div', { class: 'flex items-center gap-3' }, [
                h(UAvatar, { src: implementator.photoProfile || undefined, size: 'lg' }),
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
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatCurrency(Number(row.getValue('subscription')) || 0),
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
        header: 'Commission',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.commissionPercentage) + '%'),
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

const managerResellColumns: TableColumn<InvoiceSalesResellData>[] = [
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
            return new Date(row.getValue('paidDate')).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
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
        accessorKey: 'subscription',
        header: 'Subscription',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatCurrency(Number(row.getValue('subscription')) || 0),
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
        header: 'Commission',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.commissionPercentage) + '%'),
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

const onSelectTeamMember = (event: any, row: any) => {
    const data = row?.original || row
    if (data?.employeeId) {
        navigateTo(`/${data.employeeId}/sales`)
    }
}

const fetchData = async () => {
    const additionalService = new AdditionalService()
    await additionalService.getCurrentPeriod()
    const employeeService = new EmployeeService()
    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data
}

const fetchTeamData = async () => {
    if (!year.value || !month.value) return
    const teamService = new TeamService()
    const response = await teamService.getManagerTeam(route.params.id as string, { month: month.value, year: year.value })
    teamData.value = response.data

    const commissionService = new CommissionService()
    const commissionResponse = await commissionService.managerCommissionSummary(route.params.id as string, { month: month.value, year: year.value })
    if (commissionResponse?.data) {
        commissionData.value = commissionResponse.data
    }
}

const fetchManagerInvoiceData = async () => {
    if (!year.value || !month.value) return
    const invoiceService = new InvoiceService()
    const params = { month: month.value, year: year.value }

    // Invoice pribadi manager sendiri (sales_id = manager), hanya status recurring
    const internalResponse = await invoiceService.getInvoiceInternal(route.params.id as string, params)
    managerInternalData.value = internalResponse.data.filter(row => row.status === 'recurring')

    const resellResponse = await invoiceService.getInvoiceResell(route.params.id as string, params)
    managerResellData.value = resellResponse.data.filter(row => row.status === 'recurring')
}

watch([year, month], () => {
    fetchTeamData()
    fetchManagerInvoiceData()
})

fetchData()
</script>