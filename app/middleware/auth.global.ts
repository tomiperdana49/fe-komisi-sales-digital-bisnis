export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { state } = useAuth()
    
    // /tv: layar TV tanpa login, BE memeriksa ?key=
    if (!state.token && to.path !== '/sign-in' && to.path !== '/tv') {
      return navigateTo('/sign-in')
    }
})