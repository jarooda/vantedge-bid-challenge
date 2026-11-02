<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import Input from '@/components/ui/Input.vue'
import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown.vue'
import ResponsiveTable, {
  type ResponsiveColumn
} from '@/components/ui/ResponsiveTable.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useFetch } from '@/composables/useFetch'
import { useQuery } from '@/composables/useQuery'
import { debounce } from '@/utils/debounce'
import {
  DOCUMENT_STATUSES,
  type ApiResponse,
  type Document,
  type DocumentStatus
} from '@/types'

const { data, error, pending } =
  useFetch<ApiResponse<Document[]>>('./dummy.json')
const documents = computed(() => data.value?.data ?? [])
const loading = computed(() => pending.value || (!data.value && !error.value))

type BadgeColor = InstanceType<typeof StatusBadge>['$props']['color']

const columns: ResponsiveColumn[] = [
  { key: 'name', header: 'Nama Paket', primary: true },
  { key: 'id', header: 'Kode' },
  { key: 'agency', header: 'Instansi' },
  { key: 'hps', header: 'HPS', numeric: true },
  { key: 'deadline', header: 'Batas Waktu' },
  { key: 'status', header: 'Status' }
]

const statusColors: Record<DocumentStatus, BadgeColor> = {
  Draft: 'neutral',
  Tayang: 'info',
  Evaluasi: 'warning',
  Selesai: 'success',
  Dibatalkan: 'danger'
}

const search = useQuery('q')
const searchInput = ref(search.value)
const updateSearch = debounce((value: string) => (search.value = value), 300)

watch(searchInput, value => updateSearch(value))
watch(search, value => {
  if (value !== searchInput.value) searchInput.value = value
})
onBeforeUnmount(() => updateSearch.cancel())
const status = useQuery('status')

const statusOptions: DropdownOption<string>[] = [
  { label: 'Semua status', value: '' },
  ...DOCUMENT_STATUSES.map(s => ({ label: s, value: s }))
]

const filteredDocuments = computed(() => {
  const q = search.value.trim().toLowerCase()
  return documents.value.filter(
    d =>
      (!status.value || d.status === status.value) &&
      (!q || [d.name, d.id, d.agency].some(f => f.toLowerCase().includes(q)))
  )
})

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
})
const formatDate = (value: string) =>
  dayjs(value).locale('id').format('D MMM YYYY')
</script>

<template>
  <div class="flex flex-col gap-4 py-6">
    <div class="flex flex-col gap-3 sm:flex-row">
      <div class="sm:flex-1">
        <Input
          v-model="searchInput"
          clearable
          aria-label="Cari dokumen"
          placeholder="Cari nama paket, kode, atau instansi…"
        />
      </div>
      <div class="sm:w-56">
        <Dropdown
          v-model="status"
          :options="statusOptions"
          label="Filter status"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="flex flex-col gap-3"
      aria-busy="true"
      aria-label="Memuat dokumen"
    >
      <div
        v-for="n in 5"
        :key="n"
        class="flex animate-pulse gap-4 rounded-lg border border-slate-100 bg-white p-4"
      >
        <div class="h-4 flex-2 rounded bg-slate-100" />
        <div class="h-4 flex-1 rounded bg-slate-100" />
        <div class="h-4 flex-1 rounded bg-slate-100" />
        <div class="h-4 w-16 rounded-full bg-slate-100" />
      </div>
    </div>

    <p
      v-else-if="error"
      role="alert"
      class="py-8 text-center text-sm text-red-700"
    >
      Gagal memuat dokumen.
    </p>

    <template v-else>
      <p class="text-sm text-slate-500" aria-live="polite">
        Menampilkan {{ filteredDocuments.length }} dari
        {{ documents.length }} dokumen
      </p>
      <ResponsiveTable
        v-if="filteredDocuments.length"
        :columns="columns"
        :data="filteredDocuments"
      >
        <template #cell-hps="{ value }">{{
          currency.format(value as number)
        }}</template>
        <template #cell-deadline="{ value }">{{
          formatDate(value as string)
        }}</template>
        <template #cell-status="{ value }">
          <StatusBadge
            :color="statusColors[value as DocumentStatus]"
            dot
            pill
            >{{ value }}</StatusBadge
          >
        </template>
      </ResponsiveTable>
      <p v-else class="py-8 text-center text-sm text-slate-500">
        Tidak ada dokumen yang cocok.
      </p>
    </template>
  </div>
</template>

<style scoped></style>
