import { computed, type WritableComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useQuery(
  key: string,
  defaultValue = ''
): WritableComputedRef<string> {
  const route = useRoute()
  const router = useRouter()

  return computed({
    get() {
      const value = route.query[key]
      const first = Array.isArray(value) ? value[0] : value
      return first ?? defaultValue
    },
    set(value) {
      const query = { ...route.query }
      if (value === '' || value === defaultValue) delete query[key]
      else query[key] = value
      router.replace({ query })
    }
  })
}
