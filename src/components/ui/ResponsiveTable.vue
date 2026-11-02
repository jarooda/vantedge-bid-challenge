<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Row = Record<string, unknown>

export interface ResponsiveColumn {
  key: string
  header: string
  numeric?: boolean
  align?: 'left' | 'center' | 'right'
  primary?: boolean
  hideOnStack?: boolean
}

const props = withDefaults(
  defineProps<{
    columns: ResponsiveColumn[]
    data: Row[]
    rowKey?: (row: Row, index: number) => string | number
    breakpoint?: number
    clickable?: boolean
  }>(),
  {
    rowKey: (row: Row, i: number) =>
      row.id != null ? (row.id as string | number) : i,
    breakpoint: 768,
    clickable: false
  }
)

const emit = defineEmits<{ 'row-click': [row: Row] }>()

const wrapRef = ref<HTMLElement | null>(null)
const stacked = ref(false)
let ro: ResizeObserver | null = null

onMounted(() => {
  const el = wrapRef.value
  if (!el) return
  const update = () =>
    (stacked.value = (el.clientWidth || 9999) < props.breakpoint)
  update()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(update)
    ro.observe(el)
  }
})
onBeforeUnmount(() => {
  if (ro) ro.disconnect()
})

const primaryCol = computed(
  () => props.columns.find(c => c.primary) || props.columns[0]
)
const stackCols = computed(() =>
  props.columns.filter(c => c !== primaryCol.value && !c.hideOnStack)
)
</script>

<template>
  <div ref="wrapRef" class="w-full">
    <div v-if="!stacked" class="w-full overflow-x-auto">
      <table class="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th
              v-for="c in columns"
              :key="c.key"
              :class="[
                'border-b border-slate-200 bg-white px-4 whitespace-nowrap py-3 align-middle text-xs font-semibold tracking-[0.02em] text-slate-500',
                c.numeric ? 'text-right font-mono tabular-nums' : 'text-left'
              ]"
              :style="{ textAlign: c.align }"
            >
              {{ c.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in data"
            :key="rowKey(row, i)"
            :class="['group', clickable && 'cursor-pointer']"
            @click="clickable && emit('row-click', row)"
          >
            <td
              v-for="c in columns"
              :key="c.key"
              :class="[
                'border-b border-slate-100 px-4 py-3 align-middle text-slate-900 group-last:border-b-0 group-hover:bg-slate-50',
                c.numeric && 'whitespace-nowrap',
                c.numeric ? 'text-right font-mono tabular-nums' : 'text-left'
              ]"
              :style="{ textAlign: c.align }"
            >
              <slot :name="`cell-${c.key}`" :value="row[c.key]" :row="row">{{
                row[c.key]
              }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="flex flex-col gap-2.5">
      <div
        v-for="(row, i) in data"
        :key="rowKey(row, i)"
        :class="[
          'rounded-xl border border-slate-100 bg-white px-4 py-3.5',
          clickable && 'cursor-pointer active:bg-slate-50'
        ]"
        @click="clickable && emit('row-click', row)"
      >
        <div
          v-if="primaryCol"
          class="mb-2.5 text-sm font-semibold text-slate-900"
        >
          <slot
            :name="`cell-${primaryCol.key}`"
            :value="row[primaryCol.key]"
            :row="row"
            >{{ row[primaryCol.key] }}</slot
          >
        </div>
        <div
          v-for="c in stackCols"
          :key="c.key"
          class="flex items-baseline justify-between gap-4 border-slate-100 py-1.25 [&+&]:border-t"
        >
          <span class="flex-none text-xs text-slate-500">{{ c.header }}</span>
          <span
            :class="[
              'min-w-0 text-right text-[13px] text-slate-900',
              c.numeric && 'font-mono tabular-nums'
            ]"
          >
            <slot :name="`cell-${c.key}`" :value="row[c.key]" :row="row">{{
              row[c.key]
            }}</slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
