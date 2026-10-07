import { apiService } from "./api-service"
import type { EmployeeHierarchyResponseData, EmployeeResponseData } from "~/types/employee"


export class EmployeeService {
    async getEmployee(employeeId: string): Promise<EmployeeResponseData> {
        try {
            const response = await apiService.client.get(`/employee/${employeeId}`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getEmployeeHierarchy(employeeId: string, period?: { month?: number, year?: number }): Promise<EmployeeHierarchyResponseData> {
        try {
            const response = await apiService.client.get(`/employee/${employeeId}/hierarchy`, {
                params: { month: period?.month, year: period?.year },
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}