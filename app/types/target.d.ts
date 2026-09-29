export interface BranchTarget {
    id: number;
    branch_id: string;
    organization_name: string;
    year: number;
    month: number;
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
        rules: { am: RewardRule; sm: RewardRule };
    };
}

export interface BranchTargetPayload {
    branchId: string;
    organizationName: string;
    year: number;
    month: number;
    targetNewMrc: number;
}
