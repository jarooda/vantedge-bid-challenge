<script setup lang="ts">
import { computed, useSlots } from 'vue'

type InputSize = 'sm' | 'md' | 'lg'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    size?: InputSize
    invalid?: boolean
    disabled?: boolean
    modelValue?: string
    prefix?: string
    suffix?: string
    clearable?: boolean
  }>(),
  {
    size: 'md',
    invalid: false,
    disabled: false,
    modelValue: '',
    prefix: undefined,
    suffix: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const slots = useSlots()

const sizes: Record<InputSize, { wrap: string; input: string }> = {
  sm: { wrap: 'text-sm', input: 'h-8' },
  md: { wrap: 'text-sm', input: 'h-[38px]' },
  lg: { wrap: 'text-base', input: 'h-11' }
}

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    props.modelValue != null &&
    props.modelValue !== ''
)

const wrapClass = computed(() => [
  'inline-flex w-full items-center gap-2 rounded-lg border bg-white px-3 shadow-xs transition max-sm:text-base',
  sizes[props.size].wrap,
  props.invalid
    ? 'border-red-500 focus-within:ring-3 focus-within:ring-red-500/20'
    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/20',
  props.disabled && 'pointer-events-none bg-slate-50 opacity-55'
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div :class="wrapClass">
    <span
      v-if="slots.icon"
      class="inline-flex flex-none text-slate-500 [&_svg]:size-[1.15em]"
    >
      <slot name="icon" />
    </span>
    <span
      v-if="slots.prefix || props.prefix"
      class="flex-none text-[0.95em] whitespace-nowrap text-slate-500 select-none"
    >
      <slot name="prefix">{{ props.prefix }}</slot>
    </span>
    <input
      :class="[
        'min-w-0 flex-auto border-none bg-transparent font-sans text-slate-900 outline-none placeholder:text-slate-500 max-sm:h-11',
        sizes[props.size].input
      ]"
      :value="props.modelValue"
      :disabled="props.disabled"
      :aria-invalid="props.invalid || undefined"
      v-bind="$attrs"
      @input="onInput"
    />
    <button
      v-if="showClear"
      type="button"
      class="inline-flex size-[1.3em] flex-none cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900"
      aria-label="Clear"
      @click="onClear"
    >
      <svg
        class="size-[0.9em]"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
    <span
      v-if="slots.suffix || props.suffix"
      class="flex-none text-[0.95em] whitespace-nowrap text-slate-500 select-none"
    >
      <slot name="suffix">{{ props.suffix }}</slot>
    </span>
    <span
      v-if="slots.trailing"
      class="inline-flex flex-none text-slate-500 [&_svg]:size-[1.15em]"
    >
      <slot name="trailing" />
    </span>
  </div>
</template>
