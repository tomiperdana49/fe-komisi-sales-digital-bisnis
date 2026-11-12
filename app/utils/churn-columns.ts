import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { SalesChurnData } from '~/types/sales'
import { formatCurrency } from './formatters'

const formatShortDate = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

/**
 * Kolom tabel churn (layanan unreg) untuk halaman sales dan manager.
 * withSales: tampilkan kolom Account Manager (dipakai di daftar churn tim manager).
 */
export const buildChurnColumns = (options: { withSales?: boolean } = {}): TableColumn<SalesChurnData>[] => {
    const columns: TableColumn<SalesChurnData>[] = [
        {
            header: 'Service',
            meta: { class: { th: 'min-w-[250px]', td: 'min-w-[250px]' } },
            cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
                h('a', {
                    href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                    target: '_blank',
                    class: ['text-info hover:underline font-semibold']
                }, row.original.customerServiceId),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.serviceName)
            ])
        },
        {
            header: 'Customer',
            meta: { class: { th: 'min-w-[250px]', td: 'min-w-[250px]' } },
            cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
                h('a', {
                    href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                    target: '_blank',
                    class: ['text-info hover:underline font-semibold']
                }, row.original.customerId),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.customerCompany)
            ])
        },
        {
            header: 'Activation Date',
            cell: ({ row }) => formatShortDate(row.original.activationDate)
        },
        {
            header: 'Churn Date',
            cell: ({ row }) => formatShortDate(row.original.unregDate)
        },
        {
            header: 'MRC Lost',
            cell: ({ row }) => h('span', { class: 'text-sm' }, formatCurrency(row.original.mrc))
        },
        {
            header: 'Reason',
            meta: { class: { th: 'min-w-[200px]', td: 'min-w-[200px]' } },
            cell: ({ row }) => h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.closeReason || '-')
        }
    ]

    if (options.withSales) {
        columns.unshift({
            header: 'Account Manager',
            meta: { class: { th: 'min-w-[180px]', td: 'min-w-[180px]' } },
            cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm font-semibold whitespace-normal break-words' }, row.original.salesName || row.original.salesId),
                h('span', { class: 'text-xs text-gray-500' }, row.original.salesId)
            ])
        })
    }

    return columns
}
