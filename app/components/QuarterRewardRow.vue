<template>
    <div class="space-y-1">
        <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Reward Q{{ reward.quarter }}</span>
            <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(reward.amount) }}</span>
                <UBadge :color="reward.eligible ? 'success' : 'neutral'" variant="soft" size="sm">
                    {{ formatPercentage(reward.percentage) }}
                </UBadge>
            </div>
        </div>
        <p class="text-xs text-gray-400">
            New MRC {{ formatCurrency(reward.achievement) }} dari target {{ formatCurrency(reward.target) }}
            · min {{ reward.thresholdPercentage }}% untuk bonus {{ formatCurrency(reward.bonus) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { QuarterReward } from '~/types/sales'

defineProps<{
    reward: QuarterReward
}>()
</script>
