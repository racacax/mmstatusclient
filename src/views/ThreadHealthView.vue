<script setup lang="ts">
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

const { data: threadHealth, error, loading } = APIClient.getThreadHealth()

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatLastError(seconds: number | null): string {
  if (seconds === null) return '—'
  return `${Math.floor(seconds)}s ago`
}
</script>

<template>
  <h2>Thread Health</h2>
  <span>Shows the health status of each backend thread</span>
  <div class="w-100">
    <ErrorManager :error="error">
      <template #body>
        <LoadingComponent v-if="loading" />
        <div class="w-100 overflow-x-auto" v-else>
          <table class="table table-striped table-sm w-100" data-toggle="table">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Thread Name</th>
                <th scope="col">Uptime</th>
                <th scope="col">Last Error</th>
                <th scope="col">Error Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, name) in threadHealth" :key="name">
                <td>
                  <FontAwesomeIcon
                    :icon="faCircle"
                    :style="{ color: entry.is_alive ? 'var(--bs-success)' : 'var(--bs-danger)' }"
                  />
                </td>
                <td>{{ name }}</td>
                <td>{{ formatUptime(entry.uptime_seconds) }}</td>
                <td>{{ formatLastError(entry.seconds_since_last_error) }}</td>
                <td>{{ entry.error_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </ErrorManager>
  </div>
</template>
