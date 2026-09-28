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
    implementator: {
        name: string;
        employeeId: string;
        photoProfile: string;
    };
    subscription: number;
    mrc: number;
    commissionPercentage: number;
    commission: number;
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
    subscription: number;
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
        total: TrendData;
    };
    mrc: TrendData;
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