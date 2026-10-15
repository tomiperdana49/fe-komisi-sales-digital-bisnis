<template>
    <UModal
        v-model:open="open"
        title="Laporkan Masalah"
        description="Berikan informasi detail mengenai masalah yang ditemukan."
        :ui="{
            content: 'sm:max-w-md feedback-exclude',
            overlay: 'bg-black/40 feedback-exclude',
            footer: 'justify-between'
        }"
    >
        <template #body>
            <div class="mb-4 space-y-1">
                <p class="text-sm text-muted leading-relaxed">
                    Kami terus meningkatkan sistem informasi agar berjalan dengan baik untuk semua orang. Terima kasih atas feedback Anda.
                </p>
                <a :href="state.url" target="_blank" class="text-sm font-medium text-blue-500 underline break-all">
                    {{ state.url }}
                </a>
            </div>

            <UForm id="feedback-form" :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
                <UFormField label="Tipe" name="type" required>
                    <URadioGroup
                        v-model="state.type"
                        indicator="end"
                        variant="card"
                        orientation="horizontal"
                        :items="FEEDBACK_TYPES"
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Deskripsi" name="message" required>
                    <UTextarea
                        v-model="state.message"
                        :rows="4"
                        :maxlength="MAX_MESSAGE_LENGTH"
                        placeholder="Jelaskan feedback Anda..."
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Lampiran" name="images" required>
                    <UFileUpload
                        v-model="state.images"
                        layout="grid"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        :interactive="false"
                        class="w-full min-h-25"
                    >
                        <template #actions="{ open: openFileSelect }">
                            <UButton
                                label="Pilih Gambar"
                                icon="i-lucide-upload"
                                color="neutral"
                                variant="outline"
                                :disabled="!canAddMoreImages"
                                @click="openFileSelect()"
                            />
                        </template>

                        <template #files-top="{ open: openFileSelect, files }">
                            <div v-if="files?.length" class="mb-2 flex items-center justify-between">
                                <p class="font-bold text-sm">Lampiran ({{ files.length }}/{{ MAX_IMAGES }})</p>
                                <UButton
                                    icon="i-lucide-plus"
                                    label="Tambah lagi"
                                    color="neutral"
                                    variant="outline"
                                    :disabled="!canAddMoreImages"
                                    @click="openFileSelect()"
                                />
                            </div>
                        </template>
                    </UFileUpload>
                </UFormField>
            </UForm>
        </template>

        <template #footer>
            <UButton
                label="Riwayat"
                color="primary"
                variant="ghost"
                icon="i-lucide-history"
                :to="FEEDBACK_SHEET_URL"
                target="_blank"
            />
            <div class="flex gap-2">
                <UButton label="Batal" color="neutral" variant="outline" :disabled="saving" @click="open = false" />
                <UButton label="Simpan" color="primary" type="submit" form="feedback-form" :loading="saving" />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { FeedbackService } from '~/services/feedback-service'

// Sama dengan FEEDBACK_TYPES di backend
const FEEDBACK_TYPES = [
    { value: 'issue', label: 'Masalah' },
    { value: 'suggestion', label: 'Saran' },
    { value: 'compliment', label: 'Pujian' }
]
const MAX_MESSAGE_LENGTH = 2000
const MAX_IMAGES = 3

const open = defineModel<boolean>('open', { default: false })

const { screenshotFile, currentUrl } = useFeedback()
const feedbackService = new FeedbackService()
const toast = useToast()

const schema = z.object({
    type: z.string().min(1, 'Tipe wajib dipilih'),
    message: z.string().trim().min(1, 'Deskripsi wajib diisi'),
    images: z.array(z.any()).min(1, 'Minimal 1 lampiran').max(MAX_IMAGES, `Maksimal ${MAX_IMAGES} lampiran`)
})

const state = reactive({
    type: 'issue',
    message: '',
    images: [] as File[],
    url: ''
})

const canAddMoreImages = computed(() => state.images.length < MAX_IMAGES)
const saving = ref(false)

const onSubmit = async () => {
    saving.value = true
    try {
        await feedbackService.sendFeedback({ ...state })
        toast.add({ title: 'Feedback berhasil dikirim', description: 'Terima kasih atas feedback Anda.', color: 'success', icon: 'i-lucide-circle-check' })
        open.value = false
    } finally {
        saving.value = false
    }
}

// Setiap modal dibuka: form baru, dengan URL halaman & screenshot sebagai lampiran pertama
watch(open, (isOpen) => {
    if (!isOpen) return
    state.type = 'issue'
    state.message = ''
    state.url = currentUrl.value || window.location.href
    state.images = screenshotFile.value ? [screenshotFile.value] : []
})
</script>
