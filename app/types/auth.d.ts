export interface User {
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
    is_admin?: boolean
}

export interface AuthData {
    user: User
    accessToken: string
    refreshToken: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data: AuthData
}