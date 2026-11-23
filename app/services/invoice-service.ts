
import { apiService } from "./api-service"
import type { InvoiceSalesInternalResponseData, InvoiceSalesResellResponseData, SalesInvoiceQueryParams, SalesChurnResponseData, SalesReferralResponseData } from "~/types/sales"
import type { InvoiceImplementatorResponseData, ImplementatorInvoiceQueryParams, ImplementatorChurnResponseData } from "~/types/implementator"
import type { SnapshotListQueryParams, SnapshotListResponseData, AccountManagerResponseData, SnapshotUpdatePayload, ReferralPayload } from "~/types/snapshot"

export class InvoiceService {
    async getSnapshotList(params: SnapshotListQueryParams): Promise<SnapshotListResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/snapshot`, {
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

    async updateSnapshot(ai: number, data: SnapshotUpdatePayload): Promise<any> {
        try {
            const response = await apiService.client.patch(`/invoice/snapshot/${ai}`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getAccountManagers(): Promise<AccountManagerResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/account-manager`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getInvoiceInternal(employeeId: string, params: SalesInvoiceQueryParams): Promise<InvoiceSalesInternalResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${employeeId}/internal`, {
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

    async getInvoiceResell(employeeId: string, params: SalesInvoiceQueryParams): Promise<InvoiceSalesResellResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${employeeId}/resell`, {
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

    async getSalesChurn(employeeId: string, params: SalesInvoiceQueryParams): Promise<SalesChurnResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${employeeId}/sales/churn`, {
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

    async getInvoiceImplementator(employeeId: string, params: ImplementatorInvoiceQueryParams): Promise<InvoiceImplementatorResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${employeeId}/implementator`, {
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

    async getImplementatorChurn(implementatorId: string, params: ImplementatorInvoiceQueryParams): Promise<ImplementatorChurnResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${implementatorId}/implementator/churn`, {
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

    async getReferrerCandidates(): Promise<AccountManagerResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/referrer-candidates`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async setReferral(ai: number, data: ReferralPayload): Promise<any> {
        try {
            const response = await apiService.client.put(`/invoice/snapshot/${ai}/referral`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async deleteReferral(ai: number): Promise<any> {
        try {
            const response = await apiService.client.delete(`/invoice/snapshot/${ai}/referral`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getReferralInvoice(employeeId: string, params: SalesInvoiceQueryParams): Promise<SalesReferralResponseData> {
        try {
            const response = await apiService.client.get(`/invoice/${employeeId}/referral`, {
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