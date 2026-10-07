
<template>
    <div class="h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <HeroBackground/>

        <UContainer class="max-w-md relative z-10">
            <div
                class="p-0"
            >
                <UCard>
                  <div class="space-y-4">
                    <div class="flex justify-center mb-3">
                        <img
                            src="/logo.webp"
                            alt="Sele-Sele Logo"
                            class="h-12 w-auto object-contain transition-transform hover:scale-110 duration-300"
                        />
                    </div>
                    
                    <div class="space-y-0 text-center">
                        <p class="text-gray-700 dark:text-gray-300 text-md font-semibold">
                            DIGITAL BUSINESS SALES  <br>COMMISSION
                        </p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs">
                            Please log in to access your dashboard.
                        </p>
                    </div>

                    <UAuthForm
                      :fields="fields"
                      :schema="schema"
                      :loading="loading"
                      class="w-full"
                      @submit="onSubmit"
                    />

                    <div class="flex items-center">
                      <div class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
                      <span class="text-sm text-gray-500 px-1">
                        OR
                      </span>
                      <div class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    
                    <UButton
                        variant="soft"
                        size="lg"
                        color="neutral"
                        class="w-full justify-center group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                        :loading="googleLoading"
                        @click="handleGoogleLogin"
                    >
                        <template v-if="!googleLoading" #leading>
                            <Icon name="logos:google-icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        </template>
                        <span class="font-medium">
                            {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
                        </span>
                    </UButton>
                    
                    <!-- Footer -->
                    <div class="pt-4 text-center">
                      <p class="text-gray-600 dark:text-gray-400 text-sm">
                          PT. Media Antar Nusa • © {{ new Date().getFullYear() }}
                      </p>
                    </div>
                </div>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const googleLoading = ref(false)
const toast = useToast()
import { authService } from "~/services/auth-service"
import * as z from 'zod'
import type { FormSubmitEvent } from "@nuxt/ui"

const loading = ref(false)

const INACTIVE_MESSAGE = 'Employee is no longer active'

const handleOnSuccess = async (response: any) => {
  try {
    const result = await authService.googleLogin(response.code);
    toast.add({ description: 'Login Successful', color: 'primary' })

    const { getRoute } = useDashboardRoute()
    navigateTo(getRoute(result.data.user))
  } catch (error: any) {
    toast.add({ description: error?.message === INACTIVE_MESSAGE ? 'Your account is no longer active' : 'Google Sign-In failed', color: 'error' })
  } finally {
    googleLoading.value = false
  }
};

const handleOnError = (errorResponse: any) => {
  googleLoading.value = false
  toast.add({ title: 'Google Sign-In Error', color: 'error' })
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const handleGoogleLogin = () => {
  if (!isReady.value) return
  googleLoading.value = true
  login()
}

const fields = [
  { name: 'employeeId', type: 'text' as const, label: 'Employee ID', placeholder: 'Enter your employee ID', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'Enter your password', required: true },
  { name: 'remember', type: 'checkbox' as const, label: 'Remember me' }
]

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  password: z.string().min(1, 'Password is required').min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

  async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const result = await authService.login(payload.data.employeeId, payload.data.password)
    toast.add({ description: 'Login Successful', color: 'primary' })
    
    const { getRoute } = useDashboardRoute()
    navigateTo(getRoute(result.data.user))
  } catch (error: any) {
    toast.add({ description: error?.message === INACTIVE_MESSAGE ? 'Your account is no longer active' : 'Invalid Employee ID or Password', color: 'error' })
  } finally {
    loading.value = false
  }
}

</script>