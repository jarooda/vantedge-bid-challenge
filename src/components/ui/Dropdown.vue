<script lang="ts">
export interface DropdownOption<V = string | number> {
  label: string
  value: V
  disabled?: boolean
}
</script>

<script setup lang="ts" generic="T extends string | number">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

type DropdownSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    options: DropdownOption<T>[]
    modelValue?: T | null
    placeholder?: string
    size?: DropdownSize
    invalid?: boolean
    disabled?: boolean
    label?: string
  }>(),
  {
    modelValue: null,
    label: undefined,
    placeholder: 'Pilih…',
    size: 'md',
    invalid: false,
    disabled: false
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: T] }>()

const id = useId()
const rootRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)

const sizes: Record<DropdownSize, string> = {
  sm: 'h-8 text-sm',
  md: 'h-[38px] text-sm',
  lg: 'h-11 text-base'
}

const selected = computed(() =>
  props.options.find(o => o.value === props.modelValue)
)

const triggerClass = computed(() => [
  'inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left shadow-xs transition outline-none max-sm:h-11 max-sm:text-base',
  sizes[props.size],
  props.invalid
    ? 'border-red-500 focus-visible:ring-3 focus-visible:ring-red-500/20'
    : 'border-slate-200 hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20',
  open.value && !props.invalid && 'border-indigo-500 ring-3 ring-indigo-500/20',
  props.disabled && 'pointer-events-none bg-slate-50 opacity-55'
])

function openMenu() {
  if (props.disabled) return
  open.value = true
  const i = props.options.findIndex(o => o.value === props.modelValue)
  activeIndex.value = i >= 0 ? i : props.options.findIndex(o => !o.disabled)
  nextTick(() => listRef.value?.focus())
}

function closeMenu(refocus = true) {
  open.value = false
  if (refocus) rootRef.value?.querySelector('button')?.focus()
}

function select(option: DropdownOption<T>) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  closeMenu()
}

function move(step: number) {
  const n = props.options.length
  if (!n) return
  let i = activeIndex.value
  for (let tries = 0; tries < n; tries++) {
    i = (i + step + n) % n
    if (!props.options[i]!.disabled) break
  }
  activeIndex.value = i
  listRef.value?.children[i]?.scrollIntoView({ block: 'nearest' })
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') move(1)
  else if (e.key === 'ArrowUp') move(-1)
  else if (e.key === 'Enter' || e.key === ' ') {
    const opt = props.options[activeIndex.value]
    if (opt) select(opt)
  } else if (e.key === 'Escape' || e.key === 'Tab')
    closeMenu(e.key === 'Escape')
  else return
  e.preventDefault()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
    e.preventDefault()
    openMenu()
  }
}

function onClickOutside(e: MouseEvent) {
  if (open.value && !rootRef.value?.contains(e.target as Node)) closeMenu(false)
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="rootRef" class="relative w-full">
    <button
      type="button"
      :class="triggerClass"
      :disabled="props.disabled"
      :aria-label="props.label"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="`${id}-list`"
      :aria-invalid="props.invalid || undefined"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <span
        :class="['truncate', selected ? 'text-slate-900' : 'text-slate-500']"
      >
        {{ selected?.label ?? props.placeholder }}
      </span>
      <svg
        :class="[
          'size-4 flex-none text-slate-500 transition-transform duration-150',
          open && 'rotate-180'
        ]"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <ul
      v-if="open"
      :id="`${id}-list`"
      ref="listRef"
      role="listbox"
      :aria-label="props.label"
      tabindex="-1"
      :aria-activedescendant="
        activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined
      "
      class="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg outline-none max-sm:text-base"
      @keydown="onListKeydown"
    >
      <li
        v-for="(opt, i) in props.options"
        :id="`${id}-opt-${i}`"
        :key="opt.value"
        role="option"
        :aria-selected="opt.value === props.modelValue"
        :aria-disabled="opt.disabled || undefined"
        :class="[
          'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2',
          opt.value === props.modelValue
            ? 'font-semibold text-indigo-700'
            : 'text-slate-900',
          i === activeIndex && 'bg-slate-50',
          opt.disabled && 'cursor-not-allowed opacity-55'
        ]"
        @mouseenter="!opt.disabled && (activeIndex = i)"
        @click="select(opt)"
      >
        <span class="truncate">{{ opt.label }}</span>
        <svg
          v-if="opt.value === props.modelValue"
          class="size-4 flex-none"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </li>
      <li v-if="!props.options.length" class="px-3 py-2 text-slate-500">
        Tidak ada pilihan
      </li>
    </ul>
  </div>
</template>
