export interface SnapshotListQueryParams {
    search?: string;
    status?: string;
    type?: string;
    salesId?: string;
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
}

export interface SnapshotSales {
    name: string;
    employeeId: string;
    photoProfile: string;
}

export interface SnapshotItem {
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
    serviceGroupId: string;
    serviceId: string;
    serviceName: string;
    serviceType: string;
    sales: SnapshotSales;
    implementator: SnapshotSales;
    subscription: number;
    modal: number | null;
    crossSellCount: number | null;
    baseCommission: number | null;
    mrcOverride: number | null;
    mrc: number;
    commissionPercentage: number;
    commission: number;
    isAdjust: boolean;
}

export interface SnapshotUpdatePayload {
    status?: string;
    subscription?: number;
    month_period?: number;
    total_account?: number;
    modal?: number;
    cross_sell_count?: number;
    base_commission?: number | null;
    mrc_override?: number | null;
}

export interface AccountManager {
    employeeId: string;
    name: string;
    photoProfile: string;
}

export interface AccountManagerResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: AccountManager[];
}

export interface SnapshotListMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface SnapshotListResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: SnapshotItem[];
        meta: SnapshotListMeta;
    };
}
