<script setup lang="ts">
import { computed } from 'vue'

type BadgeColor =
  'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    pill?: boolean
    dot?: boolean
  }>(),
  {
    color: 'neutral',
    pill: false,
    dot: false
  }
)

const colors: Record<BadgeColor, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-indigo-50 text-indigo-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700'
}

const cls = computed(() => [
  'inline-flex h-[22px] items-center gap-1 whitespace-nowrap font-sans text-xs leading-none font-semibold tracking-tight [&>svg]:size-[1.05em]',
  props.pill ? 'rounded-full px-3' : 'rounded-sm px-2',
  colors[props.color]
])
</script>

<template>
  <span :class="cls">
    <span v-if="props.dot" class="size-1.5 rounded-full bg-current" />
    <slot name="icon" />
    <slot />
  </span>
</template>
