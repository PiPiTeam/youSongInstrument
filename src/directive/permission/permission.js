import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions || []
    if (value && value.length > 0) {
      // const hasPermission = permissions.some(power => {
      //   return power.includes(value)
      // })
      const hasPermission = permissions.includes(value)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permission! Like v-permission="'add'"`)
    }
  }
}
