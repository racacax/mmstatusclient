<template>
  <CardComponent :title="title" :tooltip="tooltip" :classes="classes ?? 'col-6'">
    <template #main>
      <ErrorManager :error="error ?? null">
        <template #body>
          <LoadingComponent v-if="loading" />
          <div v-else class="mini-body">
            <slot name="display" />
            <div class="mini-main">{{ mainValue }}</div>
            <div v-if="subValue" class="mini-sub text-muted">{{ subValue }}</div>
            <a v-if="link" :href="link" class="small text-decoration-none mt-1">{{
              linkText ?? '→'
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
  tooltip?: string
  classes?: string
  loading: boolean
  error?: string | null
  mainValue?: string
  subValue?: string
  link?: string
  linkText?: string
}>()
</script>

<style scoped>
.mini-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6px 4px 4px;
  gap: 3px;
  min-height: 82px;
}
.mini-main {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding: 0 2px;
}
.mini-sub {
  font-size: 0.7rem;
  line-height: 1.2;
}
</style>
