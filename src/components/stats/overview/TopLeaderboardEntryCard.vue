<template>
  <CardComponent :title="title" :classes="classes" :tooltip="tooltip">
    <template #main>
      <ErrorManager :error="error ?? null">
        <template #body>
          <LoadingComponent v-if="loading" />
          <div v-else class="d-flex flex-column align-items-center py-2 gap-2 text-center">
            <slot name="display" />
            <div v-if="name">
              <div class="entry-name fw-bold lh-sm" v-html="name" />
              <div class="text-muted small mt-1">{{ points.toLocaleString() }} pts</div>
            </div>
            <div v-else>
              <div class="text-muted small">{{ points.toLocaleString() }} pts</div>
            </div>
            <a :href="link" class="small text-decoration-none text-primary">{{
              linkText ?? 'Full statistics →'
            }}</a>
          </div>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

defineProps<{
  title: string
  classes?: string
  tooltip?: string
  loading: boolean
  error?: string | null
  name?: string
  points: number
  link: string
  linkText?: string
}>()
</script>

<style scoped>
.entry-name {
  font-size: 1.05rem;
}
</style>
