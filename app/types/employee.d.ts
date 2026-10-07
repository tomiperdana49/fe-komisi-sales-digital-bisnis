export interface EmployeeResponseData {
    success: boolean;
    message: string;
    data: Employee
}

export interface Employee {
    id: number
    employee_id: string
    name: string
    email: string
    photo_profile: string
    job_position: string
    organization_name: string
    job_level: string
    branch: string
    manager_id: number
    deactivated_at: string | null
}

export interface EmployeeHierarchyResponseData {
    success: boolean;
    message: string;
    data: Employee[]
}

