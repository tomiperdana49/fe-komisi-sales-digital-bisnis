// Teks tooltip "cara hitung" untuk kolom tabel invoice sales. Rumusnya mengikuti
// be-digital-business-v2 src/helper/calculate.ts (Calculate.mrc, resellUpgradeMrc,
// internalSalesCommission, resellSalesCommission); kalau rumus di BE berubah, ubah juga di sini.

type CalcType = 'internal' | 'resell'

interface CalcRow {
    status: string
    subscription: number
    mrc: number
    monthPeriod: string | number
    monthPeriodSummary?: string
    commission: number
    commissionPercentage: number
    crossSellCount?: number
    baseCommission?: number | null
    mrcOverride?: number | null
    margin?: number | null
    modal?: number | null
}

const formatNumber = (value: number, digits = 2) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(value)

const truncPeriod = (value: number) => Math.trunc(value * 100) / 100

const statusLabel = (status: string) => getStatusBadge(status).label

export const subscriptionCalculation = (row: CalcRow): string[] => {
    const lines = [
        'Subscription = DPP invoice (sebelum PPN) untuk seluruh periode invoice.',
        `${formatCurrency(Number(row.subscription))} untuk ${formatNumber(truncPeriod(Number(row.monthPeriod)))} bulan.`
    ]
    if (row.baseCommission !== null && row.baseCommission !== undefined) {
        lines.push(`Komisi dihitung dari base manual ${formatCurrency(row.baseCommission)}, bukan dari DPP ini.`)
    }
    return lines
}

export const monthPeriodCalculation = (row: CalcRow): string[] => {
    const period = Number(row.monthPeriod)
    return [
        'Panjang periode invoice: bulan penuh = 1, sisa hari = jumlah hari ÷ jumlah hari di bulan itu.',
        `${formatNumber(truncPeriod(period))} bulan${row.monthPeriodSummary ? ` (${row.monthPeriodSummary})` : ''}.`
    ]
}

export const mrcCalculation = (row: CalcRow, type: CalcType): string[] => {
    const subscription = Number(row.subscription)
    const period = Number(row.monthPeriod) || 1
    const mrc = Number(row.mrc)

    if (row.mrcOverride !== null && row.mrcOverride !== undefined) {
        return ['MRC diisi manual lewat edit invoice.', `MRC = ${formatCurrency(mrc)}`]
    }
    if (['recurring', 'termin', 'setup'].includes(row.status)) {
        return [`${statusLabel(row.status)} bukan penjualan baru, jadi tidak dihitung sebagai MRC.`, 'MRC = Rp 0']
    }
    if (mrc === 0 && type === 'resell' && ['prorate', 'upgrade'].includes(row.status)) {
        return [
            'Service ini sudah punya invoice New di periode yang sama, jadi MRC-nya sudah terhitung di invoice New.',
            'MRC = Rp 0'
        ]
    }

    const isUpgradeResell = type === 'resell' && row.status === 'upgrade'
    const divisor = isUpgradeResell ? truncPeriod(period) : period
    if (['upgrade', 'add'].includes(row.status) && divisor < 1) {
        return [
            'MRC = nilai 1 bulan. Periode kurang dari 1 bulan, jadi MRC = DPP penuh (tidak dibagi).',
            `MRC = ${formatCurrency(subscription)}`
        ]
    }

    const lines = [
        'MRC = nilai 1 bulan = DPP ÷ periode (bulan).',
        `${formatCurrency(subscription)} ÷ ${formatNumber(divisor, isUpgradeResell ? 2 : 4)} = ${formatCurrency(mrc)}`
    ]
    if (isUpgradeResell) lines.push('Periode upgrade resell dipotong ke 2 desimal.')
    return lines
}

export const commissionCalculation = (row: CalcRow, type: CalcType): string[] => {
    const subscription = Number(row.subscription)
    const hasManualBase = row.baseCommission !== null && row.baseCommission !== undefined
    const base = hasManualBase ? Number(row.baseCommission) : subscription
    const baseLabel = hasManualBase ? 'base manual' : 'DPP'
    const percentage = Number(row.commissionPercentage)
    const period = Number(row.monthPeriod) || 1
    const lines: string[] = []

    if (type === 'internal') {
        if (['upgrade', 'prorate', 'add'].includes(row.status)) {
            lines.push(`${statusLabel(row.status)} internal: 20%.`)
        } else if (['new', 'termin'].includes(row.status)) {
            lines.push(Number(row.crossSellCount) > 0
                ? `${statusLabel(row.status)} dengan cross-sell (${row.crossSellCount} layanan lain): 15%.`
                : `${statusLabel(row.status)} tanpa cross-sell: 12%.`)
        } else if (row.status === 'setup') {
            lines.push('Setup: tidak ada komisi sales.')
        } else {
            lines.push('Recurring internal: 1%.')
        }

        if (row.status === 'new' && period > 12) {
            const first12 = base * (12 / period)
            lines.push(
                'Kontrak lebih dari 12 bulan: 12 bulan pertama dapat tarif penuh, sisanya 1%.',
                `${formatNumber(percentage)}% × ${formatCurrency(first12)} + 1% × ${formatCurrency(base - first12)} = ${formatCurrency(row.commission)}`
            )
            return lines
        }
    } else {
        if (row.status === 'recurring') {
            lines.push('Recurring resell: 0,5%.')
        } else if (row.status === 'add') {
            lines.push('Penambahan user resell: flat 2,5%.')
        } else if (row.status === 'setup') {
            lines.push('Setup: tidak ada komisi sales.')
        } else if (row.status === 'termin') {
            lines.push('Termin resell: 2,5%.')
        } else if (!row.modal) {
            lines.push('Modal belum diisi, margin dianggap 2,5% → tarif 2,5%.')
        } else {
            lines.push(
                `Margin ${formatNumber(Number(row.margin))}% → ${formatNumber(percentage)}%.`,
                'Tier margin: ≥ 15% → 5%, ≥ 10% → 4%, < 10% → 2,5%.'
            )
        }
    }

    lines.push(`${formatNumber(percentage)}% × ${baseLabel} ${formatCurrency(base)} = ${formatCurrency(row.commission)}`)
    return lines
}
