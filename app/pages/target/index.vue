<template>
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <HeroBackground />

        <div class="py-6">
            <h1 class="text-2xl font-bold text-highlighted">Target New MRC</h1>
            <p class="text-sm text-gray-500">
                Target New MRC per AM per bulan, berdasarkan branch dan organisasi. Target berlaku mulai bulan yang dipilih sampai ada target baru untuk branch dan organisasi yang sama.
                Urutan pencarian: branch + organisasi, branch saja, organisasi saja, lalu default.
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
                    <div class="grid grid-cols-2 gap-3">
                        <UFormField label="Berlaku mulai bulan">
                            <USelect v-model="form.month" :items="monthOptions" class="w-full" />
                        </UFormField>
                        <UFormField label="Tahun">
                            <USelect v-model="form.year" :items="yearOptions" class="w-full" />
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
import type { BranchOption, BranchTarget, BranchTargetPayload, OrganizationOption, RewardRule } from '~/types/target'

const UButton = resolveComponent('UButton')

const targetService = new TargetService()
const toast = useToast()

const targets = ref<BranchTarget[]>([])
const branches = ref<BranchOption[]>([])
const organizations = ref<OrganizationOption[]>([])
const rules = ref<{ am: RewardRule; sm: RewardRule }>()
const loading = ref(false)
const saving = ref(false)

const now = new Date()
const form = ref<BranchTargetPayload>({
    branchId: '',
    organizationName: '*',
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    targetNewMrc: 0
})

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, i, 1)),
    value: i + 1
}))
const yearOptions = [2025, 2026, 2027, 2028, 2029, 2030]

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

const columns: TableColumn<BranchTarget>[] = [
    {
        accessorKey: 'branch_id',
        header: 'Branch',
        cell: ({ row }) => `${row.original.branch_id} - ${branchName(row.original.branch_id)}`
    },
    {
        accessorKey: 'organization_name',
        header: 'Organisasi',
        cell: ({ row }) => organizationName(row.original.organization_name)
    },
    {
        id: 'period',
        header: 'Berlaku mulai',
        cell: ({ row }) => `${monthOptions[row.original.month - 1]?.label} ${row.original.year}`
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
        rules.value = response.data.rules
    } finally {
        loading.value = false
    }
}

const edit = (target: BranchTarget) => {
    form.value = {
        branchId: target.branch_id,
        organizationName: target.organization_name,
        year: target.year,
        month: target.month,
        targetNewMrc: target.target_new_mrc
    }
}

const submit = async () => {
    saving.value = true
    try {
        await targetService.saveTarget(form.value)
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
