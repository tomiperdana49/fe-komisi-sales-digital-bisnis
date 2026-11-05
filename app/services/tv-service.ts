import { apiService } from './api-service'

/** Satu orang di layar TV: tanpa ID dan tanpa nominal. Urutan baris = peringkat. */
export interface TvMrcRow {
    name: string
    photoProfile: string
    branch: string
    hasMrc: boolean
    /** MRC dibanding target bulanan; null kalau tidak punya target atau masih masa percobaan. */
    achievementPercentage: number | null
    /** Bergabung kurang dari 6 bulan. */
    isNewJoiner: boolean
}

/** Di bawah 10% tetap satu desimal supaya 0,5% tidak terbaca 0%. */
export const formatAchievement = (value: number) =>
    `${value.toLocaleString('id-ID', { maximumFractionDigits: value < 10 ? 1 : 0 })}%`

export interface TvMrcPeriod {
    year: number
    month: number
    startDate: string
    endDate: string
    /** Account Manager */
    rows: TvMrcRow[]
    /** Sales Manager */
    managers: TvMrcRow[]
}

export interface TvMrcData {
    previous: TvMrcPeriod
    current: TvMrcPeriod
    generatedAt: string
}

export const tvService = {
    async mrc(key: string): Promise<TvMrcData> {
        const response = await apiService.client.get('/tv/mrc', { params: { key } })
        return response.data.data
    }
}
