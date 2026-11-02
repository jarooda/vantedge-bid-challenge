import {
  ref,
  shallowRef,
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'

type FetchOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  immediate?: boolean
}

type FetchResult<T> = {
  data: Ref<T | null>
  error: Ref<Error | null>
  pending: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T = unknown>(
  url: MaybeRefOrGetter<string>,
  options: FetchOptions = {}
): FetchResult<T> {
  const { method = 'GET', body, immediate = true } = options

  const data = shallowRef<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  let controller: AbortController | null = null

  async function execute() {
    controller?.abort()
    const current = new AbortController()
    controller = current
    pending.value = true
    error.value = null

    try {
      const res = await fetch(toValue(url), {
        method,
        signal: current.signal,
        headers:
          body !== undefined
            ? { 'Content-Type': 'application/json' }
            : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined
      })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      data.value = (await res.json()) as T
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      error.value = e as Error
    } finally {
      if (controller === current) pending.value = false
    }
  }

  if (immediate) watchEffect(() => void execute())

  return { data, error, pending, execute }
}
