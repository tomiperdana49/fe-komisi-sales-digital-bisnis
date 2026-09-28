import { apiService } from "./api-service"
import type { BranchTargetPayload, TargetListResponseData } from "~/types/target"

export class TargetService {
    async getTargets(): Promise<TargetListResponseData> {
        try {
            const response = await apiService.client.get(`/target`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async saveTarget(data: BranchTargetPayload): Promise<any> {
        try {
            const response = await apiService.client.put(`/target`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async deleteTarget(id: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/target/${id}`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }
}
