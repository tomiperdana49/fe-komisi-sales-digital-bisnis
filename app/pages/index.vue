<template>
    <UContainer>
        <HeroBackground />
        <div class="space-y-8 py-8">
        <UPageHeader
            :title="`Hello, ${authState.user?.name ?? ''} 👋`"            
            :description="`${greeting}, Have a nice day 😃`"
        >
        </UPageHeader>
        </div>

        <div class="py-2">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="space-y-1">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                    My Team
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Team member list
                </p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <USelectMenu v-model="selectedMonthObject" :items="monthItems" class="w-full sm:w-40" />
                <USelectMenu v-model="year" :items="yearItems" class="w-full sm:w-28" />
                <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" class="w-full sm:w-64" placeholder="Search..." />
            </div>
        </div>
        </div>

        <div class="py-2">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UPageCard
                v-for="card in filteredEmployeeCards"
                :key="card.employeeId"
                :to="card.to"
            >
                <template #body>
                    <UUser
                        :avatar="{ src: card.photoProfile, alt: card.name }"
                        class="w-full"
                        :ui="{ avatar: 'h-14 w-14' }"
                    >
                        <div class="min-w-0">
                        <div class="flex items-center gap-2 min-w-0">
                            <h1 class="text-md font-medium text-gray-900 dark:text-white truncate">
                                {{ card.name }}
                            </h1>
                            <UBadge v-if="card.inactive" label="Nonaktif" color="neutral" variant="subtle" size="sm" class="shrink-0" />
                        </div>

                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                            {{ card.employeeId }} - {{ card.organizationName }}
                        </p>

                        <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {{ card.position }} 
                        </p>
                        </div>
                    </UUser>
                    </template>

            </UPageCard>
        </div>
        </div>

    </UContainer>
</template>

<script setup lang="ts">
import { EmployeeService } from '~/services/employee-service';
import { AdditionalService } from '~/services/additional-service';

const { state: authState } = useAuth()
const employeeCard = ref<{ employeeId: string; name: string; photoProfile: string; position: string; organizationName: string; jobLevel: string; inactive: boolean; to: string }[]>([])
const searchQuery = ref('')

// Periode komisi (cut-off 26–25): karyawan yang resign sebelum awal periode tidak ditampilkan
const month = ref<number>()
const year = ref<number>()
const yearItems = [2026, 2027, 2028, 2029, 2030]
const monthItems = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
]
const selectedMonthObject = computed({
    get: () => monthItems.find(item => item.value === month.value),
    set: (val) => { month.value = val?.value }
})
const { getRoute } = useDashboardRoute()

const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
})

const filteredEmployeeCards = computed(() => {
    if (!searchQuery.value) {
        return employeeCard.value
    }
    const query = searchQuery.value.toLowerCase()
    return employeeCard.value.filter(card => {
        return card.name.toLowerCase().includes(query) ||
               card.employeeId.toLowerCase().includes(query) ||
               card.position.toLowerCase().includes(query) ||
               card.organizationName.toLowerCase().includes(query)
    })
})

const fetchDefaultPeriod = async () => {
    const response = await new AdditionalService().getCurrentPeriod()
    if (response?.data) {
        year.value = response.data.year
        month.value = response.data.month
    }
}

const fetchEmployeeCard = async () => {
    if (!authState.user?.employee_id || !month.value || !year.value) return
    const employeeService = new EmployeeService()
    const data = await employeeService.getEmployeeHierarchy(authState.user?.employee_id, { month: month.value, year: year.value })
    employeeCard.value = data.data.map((item) => {
        return {
            photoProfile: item.photo_profile,
            name: item.name,
            employeeId: item.employee_id,
            position: item.job_position,
            organizationName: item.organization_name,
            jobLevel: item.job_level,
            inactive: Boolean(item.deactivated_at),
            to: getRoute(item),
        }
    })
}

watch([() => authState.user?.employee_id, month, year], () => {
    fetchEmployeeCard()
})

onMounted(() => {
    fetchDefaultPeriod()
})

</script>