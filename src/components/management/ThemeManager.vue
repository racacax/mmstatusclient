<script setup lang="ts">
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'

const checked = ref(localStorage.getItem('theme') !== 'light')
function switchTheme() {
  const value = checked.value ? 'light' : 'dark'
  localStorage.setItem('theme', value)
  checked.value = !checked.value
  applyTheme()
}

function applyTheme() {
  document.querySelector('body')?.setAttribute('data-bs-theme', checked.value ? 'dark' : 'light')
}
applyTheme()
</script>
<template>
  <div class="d-flex justify-content-center align-items-center pe-lg-4">
    <div class="one-quarter" id="switch">
      <input type="checkbox" class="checkbox" id="chk" :checked="checked" @change="switchTheme" />
      <label class="label" for="chk">
        <FontAwesomeIcon class="fa-moon" :icon="faMoon" />
        <FontAwesomeIcon class="fa-sun" :icon="faSun" />
        <div class="ball"></div>
      </label>
    </div>
  </div>
</template>
<style scoped>
.checkbox {
  opacity: 0;
  position: absolute;
}

.label {
  background-color: rgb(57, 180, 110);
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  height: 26px;
  width: 50px;
  transform: scale(1.5);
}

.label .ball {
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  height: 22px;
  width: 22px;
  transform: translateX(0px);
  transition: transform 0.2s linear;
}

.checkbox:checked + .label .ball {
  transform: translateX(24px);
}

.fa-moon {
  color: #f1c40f;
}

.fa-sun {
  color: #f39c12;
}
</style>
