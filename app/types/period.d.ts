export interface PeriodClosure {
    year: number;
    month: number;
    closed_by: string;
    closed_at: string;
}

export interface PeriodClosureListResponseData {
    data: {
        closures: PeriodClosure[];
        canClose: boolean;
    };
}
