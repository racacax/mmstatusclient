<template>
  <CardComponent :title="title" :tooltip="tooltip" :classes="classes ?? 'col-12 col-lg-4'">
    <template #filters>
      <slot name="filters" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || top3.length < 3" />
          <template v-else>
            <div class="podium-row">
              <div class="podium-slot" v-for="(entry, slotIdx) in podiumOrder" :key="entry.uuid">
                <div class="podium-info">
                  <img :src="`/flags/${entry.flagFile}`" class="podium-flag" :alt="entry.name" />
                  <a :href="`/#/player-statistics/${entry.uuid}`" class="podium-name"
                    ><span v-if="entry.clubTagHtml" v-html="entry.clubTagHtml" />{{ entry.name }}</a
                  >
                  <span class="podium-primary" v-html="entry.primaryValue" />
                  <span v-if="entry.secondaryValue" class="podium-secondary">{{
                    entry.secondaryValue
                  }}</span>
                </div>
                <div class="podium-stand" :class="standClasses[slotIdx]">{{ medals[slotIdx] }}</div>
              </div>
            </div>
            <div class="rest-list">
              <div v-for="(p, i) in rest" :key="p.uuid" class="rest-entry">
                <span class="rest-rank">{{ i + 4 }}.</span>
                <img :src="`/flags/${p.flagFile}`" class="rest-flag" :alt="p.name" />
                <a :href="`/#/player-statistics/${p.uuid}`" class="rest-name"
                  ><span v-if="p.clubTagHtml" v-html="p.clubTagHtml" />{{ p.name }}</a
                >
                <span class="rest-primary" v-html="p.primaryValue" />
                <span v-if="p.secondaryValue" class="rest-secondary">{{ p.secondaryValue }}</span>
              </div>
            </div>

            <div class="text-end mt-2">
              <a :href="link" class="small">{{ linkText ?? 'Full statistics →' }}</a>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

export interface PodiumEntry {
  uuid: string
  name: string
  clubTagHtml?: string
  flagFile: string
  primaryValue: string
  secondaryValue?: string
}

const props = defineProps<{
  title: string
  tooltip?: string
  classes?: string
  loading: boolean
  error: string | null
  top3: PodiumEntry[]
  rest: PodiumEntry[]
  link: string
  linkText?: string
}>()

const podiumOrder = computed(() => [props.top3[1], props.top3[0], props.top3[2]])
const standClasses = ['silver-stand', 'gold-stand', 'bronze-stand']
const medals = ['🥈', '🥇', '🥉']
</script>

<style scoped>
.podium-row {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 12px 4px 0;
}

.podium-slot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding-bottom: 8px;
  width: 100%;
  overflow: hidden;
}

.podium-flag {
  height: 18px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.podium-name {
  font-size: 0.72rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 4px;
}

.podium-primary {
  font-size: 0.75rem;
  font-weight: 700;
}

.podium-secondary {
  font-size: 0.65rem;
  color: var(--bs-secondary-color);
}

.podium-stand {
  width: 100%;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  padding: 4px 0;
}

.gold-stand {
  height: 72px;
  background: linear-gradient(160deg, #ffe066, #f5a623);
}
.silver-stand {
  height: 52px;
  background: linear-gradient(160deg, #e0e0e0, #b0b0b0);
}
.bronze-stand {
  height: 36px;
  background: linear-gradient(160deg, #e0a060, #9e6535);
}

.rest-list {
  border-top: 1px solid var(--bs-border-color);
  padding-top: 2px;
}

.rest-entry {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 6px;
  font-size: 0.95rem;
  border-radius: 4px;
}

.rest-entry:hover {
  background: var(--bs-tertiary-bg);
}

.rest-rank {
  min-width: 20px;
  text-align: right;
  color: var(--bs-secondary-color);
  font-size: 0.73rem;
  flex-shrink: 0;
}

.rest-flag {
  height: 13px;
  flex-shrink: 0;
}

.rest-name {
  text-decoration: none;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rest-primary {
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.75rem;
}

.rest-secondary {
  color: var(--bs-secondary-color);
  font-size: 0.7rem;
  white-space: nowrap;
}
</style>
