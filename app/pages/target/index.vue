<template>
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <HeroBackground />

        <div class="py-6">
            <h1 class="text-2xl font-bold text-highlighted">Target New MRC</h1>
            <p class="text-sm text-gray-500">
                Target New MRC per AM per bulan, berdasarkan branch, organisasi, atau karyawan tertentu. Target berlaku mulai bulan yang dipilih sampai bulan akhir (kalau diisi) atau sampai ada target baru untuk kombinasi yang sama.
                Urutan pencarian: karyawan, branch + organisasi, branch saja, organisasi saja, lalu default.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <UCard>
                <template #header>
                    <h3 class="font-semibold">Tambah / Ubah Target</h3>
                </template>

                <div class="space-y-4">
                    <UFormField label="Branch">
                        <USelectMenu v-model="form.branchId" :items="branchOptions" value-key="value" placeholder="Pilih branch" :search-input="{ placeholder: 'Cari branch...' }" class="w-full" />
                    </UFormField>
                    <UFormField label="Organisasi">
                        <USelectMenu v-model="form.organizationName" :items="organizationOptions" value-key="value" :search-input="{ placeholder: 'Cari organisasi...' }" class="w-full" />
                    </UFormField>
                    <UFormField label="Karyawan" help="Kosongkan untuk target branch / organisasi (semua karyawan)">
                        <USelectMenu v-model="form.employeeIds" :items="employeeOptions" value-key="value" multiple placeholder="Semua karyawan" :search-input="{ placeholder: 'Cari karyawan...' }" class="w-full" />
                    </UFormField>
                    <div class="grid grid-cols-2 gap-3">
                        <UFormField label="Berlaku mulai bulan">
                            <USelect v-model="form.month" :items="monthOptions" class="w-full" />
                        </UFormField>
                        <UFormField label="Tahun">
                            <USelect v-model="form.year" :items="yearOptions" class="w-full" />
                        </UFormField>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <UFormField label="Berlaku sampai bulan">
                            <USelect v-model="endMonth" :items="endMonthOptions" class="w-full" />
                        </UFormField>
                        <UFormField label="Tahun">
                            <USelect v-model="endYear" :items="yearOptions" :disabled="!endMonth" class="w-full" />
                        </UFormField>
                    </div>
                    <UFormField label="Target New MRC / AM / bulan">
                        <UInput v-model.number="form.targetNewMrc" type="number" min="0" class="w-full" />
                    </UFormField>
                    <UButton label="Simpan" color="primary" block :loading="saving" :disabled="!form.branchId" @click="submit" />
                </div>

                <template #footer>
                    <div v-if="rules" class="text-xs text-gray-500 space-y-1">
                        <p>Reward AM: New MRC kuartal &ge; {{ rules.am.thresholdPercentage }}% target, bonus {{ formatCurrency(rules.am.bonus) }}</p>
                        <p>Reward SM: New MRC tim &ge; {{ rules.sm.thresholdPercentage }}% target tim, bonus {{ formatCurrency(rules.sm.bonus) }}</p>
                    </div>
                </template>
            </UCard>

            <UCard class="lg:col-span-2">
                <UTable :data="targets" :columns="columns" :loading="loading" />
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { TargetService } from '~/services/target-service'
import type { BranchOption, BranchTarget, BranchTargetPayload, OrganizationOption, RewardRule, TargetEmployeeOption } from '~/types/target'

const UButton = resolveComponent('UButton')

const targetService = new TargetService()
const toast = useToast()

const targets = ref<BranchTarget[]>([])
const branches = ref<BranchOption[]>([])
const organizations = ref<OrganizationOption[]>([])
const employees = ref<TargetEmployeeOption[]>([])
const rules = ref<{ am: RewardRule; sm: RewardRule }>()
const loading = ref(false)
const saving = ref(false)

const now = new Date()
const form = ref<BranchTargetPayload>({
    branchId: '',
    organizationName: '*',
    employeeIds: [],
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    endYear: null,
    endMonth: null,
    targetNewMrc: 0
})
// Periode akhir di form: bulan 0 = tanpa batas
const endMonth = ref(0)
const endYear = ref(now.getFullYear())

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, i, 1)),
    value: i + 1
}))
const endMonthOptions = [{ label: 'Tanpa batas', value: 0 }, ...monthOptions]
const yearOptions = [2025, 2026, 2027, 2028, 2029, 2030]
const periodLabel = (year: number, month: number) => `${monthOptions[month - 1]?.label} ${year}`

const branchName = (branchId: string) => branches.value.find(b => b.branchId === branchId)?.name ?? branchId
const branchOptions = computed(() => branches.value.map(b => ({ label: `${b.branchId} - ${b.name}`, value: b.branchId })))
const organizationName = (value: string) => organizations.value.find(o => o.organizationName === value)?.name ?? value
// Organisasi yang ditampilkan mengikuti branch yang dipilih; branch Default ('*') / belum dipilih = semua organisasi
const organizationOptions = computed(() => {
    const branchId = form.value.branchId
    const showAll = !branchId || branchId === '*'
    return organizations.value
        .filter(o => o.organizationName === '*' || showAll || o.branchIds.includes(branchId))
        .map(o => ({ label: o.name, value: o.organizationName }))
})

// Ganti branch: kalau organisasi yang dipilih tidak ada di branch baru, kembali ke "Semua organisasi"
watch(organizationOptions, (options) => {
    if (!options.some(o => o.value === form.value.organizationName)) {
        form.value.organizationName = '*'
    }
})

const employeeName = (employeeId: string) => employees.value.find(e => e.employeeId === employeeId)?.name ?? employeeId
// Karyawan yang ditampilkan mengikuti branch & organisasi yang dipilih ('*' = tidak difilter)
const employeeOptions = computed(() => {
    const { branchId, organizationName } = form.value
    return employees.value
        .filter(e => (!branchId || branchId === '*' || e.branchId === branchId)
            && (organizationName === '*' || e.organizationName === organizationName))
        .map(e => ({ label: `${e.name} (${e.employeeId})`, value: e.employeeId }))
})

// Ganti branch / organisasi: buang karyawan terpilih yang tidak ada lagi di pilihan
watch(employeeOptions, (options) => {
    const selected = form.value.employeeIds.filter(id => options.some(o => o.value === id))
    if (selected.length !== form.value.employeeIds.length) {
        form.value.employeeIds = selected
    }
})

const wrap = { class: { td: 'whitespace-normal' } }
const columns: TableColumn<BranchTarget>[] = [
    {
        accessorKey: 'branch_id',
        header: 'Branch',
        meta: wrap,
        cell: ({ row }) => `${row.original.branch_id} - ${branchName(row.original.branch_id)}`
    },
    {
        accessorKey: 'organization_name',
        header: 'Organisasi',
        meta: wrap,
        cell: ({ row }) => organizationName(row.original.organization_name)
    },
    {
        accessorKey: 'employee_id',
        header: 'Karyawan',
        meta: wrap,
        cell: ({ row }) => row.original.employee_id === '*' ? 'Semua karyawan' : employeeName(row.original.employee_id)
    },
    {
        id: 'period',
        header: 'Berlaku',
        cell: ({ row }) => {
            const { year, month, end_year: endYear, end_month: endMonth } = row.original
            const end = endYear && endMonth ? periodLabel(endYear, endMonth) : 'seterusnya'
            return h('div', { class: 'leading-tight' }, [
                h('div', periodLabel(year, month)),
                h('div', { class: 'text-xs text-gray-500' }, `s.d. ${end}`)
            ])
        }
    },
    {
        accessorKey: 'target_new_mrc',
        header: 'Target / AM / bulan',
        cell: ({ row }) => formatCurrency(row.original.target_new_mrc)
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => h('div', { class: 'flex justify-end gap-1' }, [
            h(UButton, {
                icon: 'i-lucide-pencil',
                color: 'neutral',
                variant: 'ghost',
                size: 'sm',
                onClick: () => edit(row.original)
            }),
            h(UButton, {
                icon: 'i-lucide-trash-2',
                color: 'error',
                variant: 'ghost',
                size: 'sm',
                onClick: () => remove(row.original)
            })
        ])
    }
]

const fetchTargets = async () => {
    loading.value = true
    try {
        const response = await targetService.getTargets()
        targets.value = response.data.targets
        branches.value = response.data.branches
        organizations.value = response.data.organizations
        employees.value = response.data.employees
        rules.value = response.data.rules
    } finally {
        loading.value = false
    }
}

const edit = (target: BranchTarget) => {
    form.value = {
        branchId: target.branch_id,
        organizationName: target.organization_name,
        employeeIds: target.employee_id === '*' ? [] : [target.employee_id],
        year: target.year,
        month: target.month,
        endYear: target.end_year,
        endMonth: target.end_month,
        targetNewMrc: target.target_new_mrc
    }
    endMonth.value = target.end_month ?? 0
    endYear.value = target.end_year ?? target.year
}

const submit = async () => {
    saving.value = true
    try {
        await targetService.saveTarget({
            ...form.value,
            endYear: endMonth.value ? endYear.value : null,
            endMonth: endMonth.value || null
        })
        toast.add({ title: 'Target saved successfully', color: 'success' })
        await fetchTargets()
    } finally {
        saving.value = false
    }
}

const remove = async (target: BranchTarget) => {
    await targetService.deleteTarget(target.id)
    toast.add({ title: 'Target deleted', color: 'success' })
    await fetchTargets()
}

onMounted(fetchTargets)
</script>
