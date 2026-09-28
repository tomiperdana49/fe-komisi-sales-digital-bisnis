<template>
    <UHeader
        :toggle="false"
        :ui="{
        container: 'sm:px-8!',
        right: 'justify-end-safe overflow-x-auto py-2'
        }"
    >
        <template #left>
        <NuxtLink to="/">
            <img class="h-10" src="/logo.webp" alt="Logo" />
        </NuxtLink>
        </template>

        <template #right>
        <div
            role="group"
            class="flex items-center gap-1"
        >
        
            <UColorModeButton size="sm" />
            <ClientOnly>
                <UDropdownMenu
                    :items="items"
                    size="sm"
                    :content="{
                    align: 'start',
                    side: 'bottom',
                    sideOffset: 8
                    }"
                    :ui="{
                    content: 'w-48'
                    }"
                >
                    <UUser
                        size="sm"
                        :name="authState.user?.name"
                        :description="authState.user?.employee_id"
                        class="pl-2"
                        :avatar="{
                            src: authState.user?.photo_profile,
                        }"
                        :ui="{
                            name: 'hidden sm:block',
                            description: 'hidden sm:block'
                        }"
                    />
                </UDropdownMenu>
                </ClientOnly>
        </div>
        </template>
    </UHeader>
</template>

<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'
    const { state: authState, service: authService } = useAuth()
    const toast = useToast()

    const handleLogout = async () => {
        await authService.logout()
        toast.add({ title: 'Logged out successfully' })
        navigateTo('/sign-in')
    }

    const items = computed<DropdownMenuItem[]>(() => [
        ...(authState.user?.is_admin
            ? [
                { label: 'Invoice Snapshots', icon: 'i-lucide-receipt', to: '/invoice' },
                { label: 'Target New MRC', icon: 'i-lucide-target', to: '/target' }
            ]
            : []),
        {
        label: 'Sign Out',
        icon: 'i-lucide-log-out',
        onSelect: handleLogout
        },
    ])

    const toolbar = defineModel<boolean>('toolbar', {
        type: Boolean,
        default: false
    })
</script>