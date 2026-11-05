export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { state } = useAuth()
    
    // nginx mengalihkan /tv ke /tv/ (folder hasil build), jadi garis miring di akhir diabaikan
    const path = to.path.replace(/\/+$/, '')

    // /tv: layar TV tanpa login, BE memeriksa ?key=
    if (!state.token && path !== '/sign-in' && path !== '/tv') {
      return navigateTo('/sign-in')
    }
})