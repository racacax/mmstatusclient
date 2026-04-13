<template>
  <CardComponent :classes="classes" :title="title" :tooltip="tooltip">
    <template #filters>
      <slot name="custom-filters"></slot>
      <SelectInputComponent
        v-if="orderBy !== undefined"
        label="Order by"
        :options="orderBy!"
        :model-value="currentOrderBy"
        @update:model-value="currentOrderBy = $event"
      />
      <SelectInputComponent
        v-if="displayOrder"
        label="Order"
        :options="orderOptions"
        :model-value="order"
        @update:model-value="order = $event as 'desc' | 'asc'"
      />
      <NumberInputComponent
        v-if="displayPage"
        label="Page"
        :model-value="page"
        :min="1"
        @update:model-value="page = $event"
      />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="data === null" />
          <div v-else>
            <table class="table table-striped table-sm" data-toggle="table">
              <thead>
                <tr>
                  <th scope="col" v-for="(c, i) in props.columns" :key="i">{{ c }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, i) in data" :key="i">
                  <td
                    style="vertical-align: middle"
                    v-html="d"
                    v-for="d in stat"
                    :key="`${i}-${d.value}`"
                  ></td>
                </tr>
              </tbody>
            </table>
            <div class="w-100 d-flex justify-content-center" v-if="data.length === 0">
              <span>No data to display</span>
            </div>
            <div class="w-100 d-flex justify-content-end" v-if="bottomLabel">
              <i>{{ bottomLabel }}</i>
            </div>
          </div></template
        ></ErrorManager
      >
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import CardComponent from '@/components/basic/CardComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'
import NumberInputComponent from '@/components/basic/NumberInputComponent.vue'

const props = defineProps<{
  title: string
  columns: any[]
  classes?: string | undefined
  orderBy?: any[] | undefined
  displayOrder?: boolean | undefined
  displayPage?: boolean | undefined
  data: any[] | null
  callback: Function
  bottomLabel?: string | undefined
  tooltip: string
  pageNumber?: number
  error?: string | null
}>()

const orderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
]

const currentOrderBy = ref('all')
if (props.orderBy !== undefined) {
  currentOrderBy.value = props.orderBy[0].value
}
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)
watch(
  () => [props.pageNumber],
  () => {
    if (props.pageNumber !== undefined) page.value = props.pageNumber
  }
)
const data: Ref<any[] | null> = ref(props.data)
watch(
  () => [props.data],
  () => {
    data.value = props.data
  }
)
watch([order, currentOrderBy], () => {
  page.value = 1
  props.callback(order.value, currentOrderBy.value, page.value)
})
watch([page], () => props.callback(order.value, currentOrderBy.value, page.value))
</script>
