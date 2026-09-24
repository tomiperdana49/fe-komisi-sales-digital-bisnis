export interface TrendData {
    trend: 'up' | 'down';
    value: number;
    percentage: number;
    growth: number;
}

export interface ManagerMonthlyDetail {
    name: string;
    count: number;
    total: number;
    mrc: number;
    subscription: number;
}

export interface ManagerMonthlyData {
    month: string;
    detail: ManagerMonthlyDetail[];
    total: number;
}

export interface ManagerMouthlyResponseData {
    success: boolean;
    message: string;
    data: {
        total: number;
        data: ManagerMonthlyData[];
    };
}

export interface ManagerCommissionResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: ManagerCommissionData;
}

export interface ManagerCommissionData {
    managerCommission: TrendData;
    commission: {
        new: TrendData;
        recurring: TrendData;
        total: TrendData;
        custLama: TrendData;
    };
    mrc: TrendData;
    subscription: {
        new: TrendData;
        recurring: TrendData;
        total: TrendData;
        custLama: TrendData;
    };
    newCustomer: TrendData;
    newAccount: TrendData;
}

export interface ManagerCommissionYearlyResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: ManagerCommissionYearlyData[];
}

export interface ManagerCommissionYearlyData {
    managerCommission: number;
    commission: number;
    mrc: number;
    subscription: number;
    newCustomer: number;
    newAccount: number;
}
