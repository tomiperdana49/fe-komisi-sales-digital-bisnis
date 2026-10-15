const isOpen = ref(false)
const isCapturing = ref(false)
const screenshotFile = ref<File | null>(null)
const currentUrl = ref('')

export const useFeedback = () => {
    // Screenshot halaman saat ini dulu, lalu buka modal dengan screenshot sebagai lampiran pertama
    const triggerFeedback = async () => {
        isCapturing.value = true
        currentUrl.value = window.location.href
        screenshotFile.value = null

        try {
            const { domToBlob } = await import('modern-screenshot')
            const blob = await domToBlob(document.body, {
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                filter: (node: Node) => !(node instanceof HTMLElement && node.classList.contains('feedback-exclude'))
            } as any)

            if (blob) {
                screenshotFile.value = new File([blob], `screenshot_${Date.now()}.png`, { type: 'image/png' })
            }
        } catch (error) {
            console.error('Failed to capture screenshot:', error)
        } finally {
            isCapturing.value = false
            isOpen.value = true
        }
    }

    return {
        isOpen,
        isCapturing,
        screenshotFile,
        currentUrl,
        triggerFeedback
    }
}
