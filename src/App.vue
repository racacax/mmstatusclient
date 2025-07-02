<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChartSimple,
  faFileText,
  faGamepad,
  faCircleExclamation,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import CustomIcon from '@/components/basic/CustomIcon.vue'
import ThemeManager from '@/components/management/ThemeManager.vue'
const route = useRoute()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#/"
        ><img src="/images/TM.png" style="width: 50px" /> Matchmaking Status</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/active-players"
              ><FontAwesomeIcon :icon="faUsers" /> Players</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/last-games"
              ><FontAwesomeIcon :icon="faGamepad" /> Matches</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/current-status">
              <CustomIcon icon="wave-pulse" /> Status</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              aria-current="page"
              to="/statistics"
              :class="{ 'router-link-active': route.path.includes('/statistics/') }"
            >
              <FontAwesomeIcon :icon="faChartSimple" /> Statistics</RouterLink
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" target="_blank" href="/api/">
              <FontAwesomeIcon :icon="faFileText" /> Docs</a
            >
          </li>
        </ul>
        <ThemeManager />
      </div>
    </div>
  </nav>
  <div class="main">
    <!--<div class="alert alert-warning" role="alert">
      <FontAwesomeIcon :icon="faCircleExclamation" /> Some downtime might occur on July 1st.
      Matchmaking will be updated from 3v3 to 2v2 which might cause some breaking changes.
    </div>--->
    <RouterView />
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  padding: 10px;
}
.router-link-active {
  font-weight: bold;
}
</style>
