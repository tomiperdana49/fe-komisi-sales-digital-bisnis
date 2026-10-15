import { apiService } from "./api-service"
import type { FeedbackPayload } from "~/types/feedback"

export class FeedbackService {
    async sendFeedback(data: FeedbackPayload): Promise<any> {
        const formData = new FormData()
        formData.append('type', data.type)
        formData.append('message', data.message)
        formData.append('url', data.url)
        data.images.forEach(file => formData.append('images', file))

        try {
            const response = await apiService.client.post(`/feedback`, formData, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`,
                    // Biarkan browser yang mengisi Content-Type multipart beserta boundary-nya
                    'Content-Type': undefined
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }
}
