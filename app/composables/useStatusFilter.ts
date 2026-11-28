import { computed, ref, watch } from 'vue'

type StatusOption = { label: string; value: string }

/**
 * Filter status invoice yang bisa pilih lebih dari satu. Kosong = semua status.
 * Memilih "All Status" mengosongkan pilihan lain; memilih status lain melepas "All Status".
 */
export const useStatusFilter = (statuses: StatusOption[]) => {
    const statusFilter = ref<string[]>(['all'])
    const statusOptions = [{ label: 'All Status', value: 'all' }, ...statuses]

    watch(statusFilter, (value, previous) => {
        const addedAll = value.includes('all') && !(previous ?? []).includes('all')
        if (value.length === 0 || addedAll) {
            if (value.length !== 1 || value[0] !== 'all') statusFilter.value = ['all']
        } else if (value.includes('all') && value.length > 1) {
            statusFilter.value = value.filter(v => v !== 'all')
        }
    })

    const selectedStatuses = computed(() => statusFilter.value.filter(v => v !== 'all'))
    const matchesStatus = (status: string) =>
        selectedStatuses.value.length === 0 || selectedStatuses.value.includes(status)

    return { statusFilter, statusOptions, matchesStatus }
}
