import type { ManagerTeamQueryParams, ManagerTeamResponseData, ManagerTeamYearlyResponseData } from "~/types/team"
import type { SalesChurnResponseData } from "~/types/sales"
import { apiService } from "./api-service"



export class TeamService {
    async getManagerTeam(managerId: string, params: ManagerTeamQueryParams): Promise<ManagerTeamResponseData> {
        try {
            const response = await apiService.client.get(`/team/${managerId}/manager`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                params
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getManagerTeamChurn(managerId: string, params: ManagerTeamQueryParams): Promise<SalesChurnResponseData> {
        try {
            const response = await apiService.client.get(`/team/${managerId}/manager/churn`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                params
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getManagerTeamYearly(managerId: string, params?: { year: number }): Promise<ManagerTeamYearlyResponseData> {
        try {
            const response = await apiService.client.get(`/team/${managerId}/manager/yearly`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                params
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }
}