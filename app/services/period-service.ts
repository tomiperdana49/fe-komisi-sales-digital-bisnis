import { apiService } from "./api-service"
import type { PeriodClosureListResponseData } from "~/types/period"

const authHeaders = () => ({ authorization: `Bearer ${useAuth().state.token}` })

export class PeriodService {
    async getClosures(): Promise<PeriodClosureListResponseData> {
        try {
            const response = await apiService.client.get(`/period/closure`, { headers: authHeaders() })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async closePeriod(year: number, month: number): Promise<any> {
        try {
            const response = await apiService.client.post(`/period/closure`, { year, month }, { headers: authHeaders() })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async reopenPeriod(year: number, month: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/period/closure/${year}/${month}`, { headers: authHeaders() })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }
}
