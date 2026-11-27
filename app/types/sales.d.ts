export interface SalesInvoiceQueryParams {
    month: number;
    year: number;
}

export interface InvoiceSalesInternalResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: InvoiceSalesInternalData[]
}

export interface InvoiceSalesInternalData {
    ai: number;
    invoiceNumber: number;
    sequenceNumber: number;
    paidDate: string;
    status: string;
    monthPeriod: string;
    monthPeriodSummary: string;
    totalAccount: number;
    customerId: string;
    customerServiceId: number;
    customerCompany: string;
    contractUntilDate: string;
    serviceGroupId: string;
    serviceId: string;
    serviceName: string;
    serviceType: string;
    crossSellCount: number;
    periodBooster?: boolean | null;
    implementator: {
        name: string;
        employeeId: string;
        photoProfile: string;
    };
    subscription: number;
    baseCommission?: number | null;
    mrcOverride?: number | null;
    mrc: number;
    commissionPercentage: number;
    commission: number;
}

export interface SalesChurnResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: SalesChurnData[];
}

export interface SalesChurnData {
    salesId: string;
    salesName?: string;
    customerServiceId: number;
    customerId: string;
    customerCompany: string;
    serviceId: string;
    serviceName: string;
    activationDate: string | null;
    unregDate: string;
    closeReason: string | null;
    mrc: number;
}

export interface InvoiceSalesResellResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: InvoiceSalesResellData[]
}

export interface InvoiceSalesResellData {
    ai: number;
    invoiceNumber: number;
    sequenceNumber: number;
    paidDate: string;
    status: string;
    monthPeriod: string;
    monthPeriodSummary: string;
    totalAccount: number;
    customerId: string;
    customerServiceId: number;
    customerCompany: string;
    contractUntilDate: string;
    serviceGroupId: string;
    serviceId: string;
    serviceName: string;
    serviceType: string;
    crossSellCount: number;
    periodBooster?: boolean | null;
    subscription: number;
    baseCommission?: number | null;
    mrcOverride?: number | null;
    mrc: number;
    modal: number;
    price: number;
    markup: number;
    margin: number;
    commissionPercentage: number;
    commission: number;
}

export interface SalesCommissionResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: SalesCommissionData;
}

export interface TrendData {
    trend: 'up' | 'down';
    value: number;
    percentage: number;
    growth: number;
}

export interface QuarterReward {
    year: number;
    quarter: number;
    months: number[];
    target: number;
    achievement: number;
    percentage: number;
    thresholdPercentage: number;
    bonus: number;
    eligible: boolean;
    isFinalMonth: boolean;
    amount: number;
}

export interface SalesCommissionData {
    commission: {
        new: TrendData;
        recurring: TrendData;
        // Komisi Referral Internal sebagai pemberi lead (sudah termasuk di total)
        referral?: TrendData;
        total: TrendData;
    };
    mrc: TrendData;
    mrcChurn?: TrendData;
    mrcNet?: TrendData;
    subscription: {
        new: TrendData;
        recurring: TrendData;
        total: TrendData;
    };
    newCustomer: TrendData;
    newAccount: TrendData;
    reward?: QuarterReward | null;
}

export interface SalesYearlyQueryParams {
    year: number;
}

export interface SalesCommissionYearlyResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: SalesCommissionYearlyData[];
}

export interface SalesCommissionYearlyData {
    commission: number;
    mrc: number;
    subscription: number;
    newCustomer: number;
    newAccount: number;
}
export interface ReferralDeal {
    ai: number;
    invoiceNo: string | null;
    invoiceDate: string | null;
    paidDate: string | null;
    customerId: string | null;
    customerName: string | null;
    productName: string | null;
    productLine: 'internal' | 'resell';
    status: string;
    mrc: number;
    dpp: number;
    termMonths: number;
    sellerEmployeeId: string | null;
    sellerName: string | null;
    commissionPercentage: number;
    commission: number;
    eligible: boolean;
    note: string | null;
}

export interface SalesReferralResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        value: number;
        count: number;
        deals: ReferralDeal[];
    };
}
