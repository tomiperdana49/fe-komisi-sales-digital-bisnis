export interface BranchTarget {
    id: number;
    branch_id: string;
    organization_name: string;
    employee_id: string;
    year: number;
    month: number;
    end_year: number | null;
    end_month: number | null;
    target_new_mrc: number;
}

export interface BranchOption {
    branchId: string;
    name: string;
}

export interface OrganizationOption {
    organizationName: string;
    name: string;
    branchIds: string[];
}

export interface TargetEmployeeOption {
    employeeId: string;
    name: string;
    branchId: string | null;
    organizationName: string | null;
}

export interface RewardRule {
    thresholdPercentage: number;
    bonus: number;
}

export interface TargetListResponseData {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        targets: BranchTarget[];
        branches: BranchOption[];
        organizations: OrganizationOption[];
        employees: TargetEmployeeOption[];
        rules: { am: RewardRule; sm: RewardRule };
    };
}

export interface BranchTargetPayload {
    branchId: string;
    organizationName: string;
    employeeIds: string[];
    year: number;
    month: number;
    endYear: number | null;
    endMonth: number | null;
    targetNewMrc: number;
}
