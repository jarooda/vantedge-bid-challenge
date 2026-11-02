<script setup lang="ts">
import LayoutHeader from './components/layout/LayoutHeader.vue'
</script>

<template>
  <LayoutHeader />
  <main class="mx-auto max-w-7xl px-4 sm:px-6">
    <RouterView />
  </main>
</template>

<style scoped></style>
