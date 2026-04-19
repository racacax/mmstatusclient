<script setup lang="ts">
import { ref, onMounted } from 'vue'

const dropdownEl = ref<HTMLElement | null>(null)
const loaded = ref(false)

onMounted(() => {
  if (!dropdownEl.value) return
  dropdownEl.value.addEventListener('show.bs.dropdown', () => {
    loaded.value = true
  })
})
</script>

<template>
  <div class="dropdown kofi-donate" ref="dropdownEl">
    <button
      class="btn btn-sm kofi-btn"
      type="button"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-expanded="false"
    >
      <img src="/icons/kofi.png" alt="Ko-fi" class="kofi-icon" />
      Support
    </button>
    <div class="dropdown-menu dropdown-menu-end kofi-dropdown p-0">
      <iframe
        v-if="loaded"
        id="kofiframe"
        src="https://ko-fi.com/racacax/?hidefeed=true&widget=true&embed=true&preview=true"
        style="border: none; width: 100%; padding: 4px; background: #f9f9f9"
        height="712"
        title="racacax"
      ></iframe>
    </div>
  </div>
</template>

<style>
.kofi-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ff5e5b;
  color: #fff;
  border: none;
  font-weight: 600;
  padding: 4px 12px;
}
.kofi-btn:hover,
.kofi-btn:focus {
  background-color: #e04e4b;
  color: #fff;
}
.kofi-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.kofi-dropdown {
  width: 340px;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 10002 !important;
}
</style>
