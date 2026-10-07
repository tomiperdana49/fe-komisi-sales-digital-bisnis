
export interface TrendData {
    trend: 'up' | 'down';
    value: number;
    percentage: number;
    growth: number;
}

export interface InvoiceImplementatorResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: InvoiceImplementatorData[]
}

export interface ImplementatorInvoiceQueryParams {
    month: number;
    year: number;
}

export interface InvoiceImplementatorData {
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
    sales: {
        name: string;
        employeeId: string;
        photoProfile: string;
    };
    subscription: number;
    mrc: number;
    implementatorPeriodDate: string | null;
    commissionPercentage: number;
    commission: number;
}

export interface ImplementatorChurnResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: ImplementatorChurnData[];
}

export interface ImplementatorChurnData {
    customerServiceId: number;
    customerId: string;
    customerCompany: string;
    serviceId: string;
    serviceName: string;
    activationDate: string;
    unregDate: string;
}

export interface ImplementatorCommissionResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: ImplementatorCommissionData;
}

export interface ImplementatorCommissionData {
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
    churnCount: TrendData;
    newAccount: TrendData;
}

export interface ImplementatorCommissionYearlyResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: ImplementatorCommissionYearlyData[];
}

export interface ImplementatorCommissionYearlyData {
    commission: number;
    mrc: number;
    subscription: number;
    churnCount: number;
    newAccount: number;
}