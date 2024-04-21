<template>
  <div :class="`${classes ?? ''} px-1 align-items-stretch d-flex mb-2`">
    <div class="card d-flex flex-column p-2 w-100 overflow-x-auto">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>{{ title }}</h5>
        <div class="d-flex gap-2">
          <div class="d-flex flex-column gap-2" v-if="orderBy !== undefined">
            Order by:
            <select
              class="form-select form-select-sm"
              @change="
                (e) => {
                  currentOrderBy = getEventValue(e)
                }
              "
            >
              <option v-for="o in props.orderBy" :value="o.value" :key="o.value">{{ o.label }}</option>
            </select>
          </div>

          <div class="d-flex flex-column gap-2" v-if="displayOrder">
            Order:
            <select
              class="form-select form-select-sm"
              @change="
                (e) => {
                  order = getEventValue(e)
                }
              "
            >
              <option value="desc" selected>Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div class="d-flex flex-column gap-2" v-if="displayPage">
            Page:
            <input
              class="form-control form-control-sm"
              style="max-width: 80px"
              :value="page"
              min="1"
              @change="
                (e) => {
                  page = parseInt(getEventValue(e))
                }
              "
              type="number"
            />
          </div>
        </div>
      </div>
      <LoadingComponent v-if="data === null" />
      <div v-else>
        <table class="table table-striped table-sm" data-toggle="table">
          <thead>
            <tr>
              <th scope="col" v-for="c in props.columns" :key="c">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stat, i) in data" :key="i">
              <td style="vertical-align: middle" v-html="d" v-for="d in stat" :key="`${i}-${d.value}`">
              </td>
            </tr>
          </tbody>
        </table>
        <div class="w-100 d-flex justify-content-center" v-if="data.length === 0">
          <span>No data to display</span>
        </div>
        <div class="w-100 d-flex justify-content-end" v-if="bottomLabel">
          <i>{{ bottomLabel }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { getEventValue } from '@/utils'

const props = defineProps({
  title: { type: String, required: true },
  columns: { type: Array, required: true },
  classes: { type: String, required: false },
  orderBy: { type: Array, required: false },
  displayOrder: { type: Boolean, required: false },
  displayPage: { type: Boolean, required: false },
  data: { type: Array, required: true },
  callback: { type: Function, required: true },
  bottomLabel: { type: String, required: false }
})

const currentOrderBy = ref("all")
if(props.orderBy !== undefined) {
  currentOrderBy.value = props.orderBy[0].value
}
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)
const data: Ref<any[] | null> = ref(props.data)
watch(
  () => [props.data],
  () => {
    data.value = props.data
  }
)
watch([order, currentOrderBy], () => {
  page.value = 1;
  props.callback(order.value, currentOrderBy.value, page.value)
})
watch([page], () => props.callback(order.value, currentOrderBy.value, page.value))
</script>

<style scoped>
</style>
