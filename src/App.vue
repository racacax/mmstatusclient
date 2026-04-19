<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChartSimple,
  faFileText,
  faGamepad,
  faUsers,
  faHeartPulse,
  faTableCells,
  faUser,
  faEllipsis
} from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'bootstrap'
import CustomIcon from '@/components/basic/CustomIcon.vue'
import ThemeManager from '@/components/management/ThemeManager.vue'
import KofiDonateComponent from '@/components/basic/KofiDonateComponent.vue'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons/faFolderPlus'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
const route = useRoute()

function closeDropdown(e: MouseEvent) {
  const menu = e.currentTarget as HTMLElement
  const toggle = menu.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]')
  if (toggle) Dropdown.getInstance(toggle)?.hide()
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#/"
        ><img src="/images/TM.png" style="width: 50px" /> Matchmaking Stats</a
      >
      <KofiDonateComponent class="d-lg-none" />
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
            <RouterLink class="nav-link" aria-current="page" to="/"
              ><FontAwesomeIcon :icon="faTableCells" /> Overview</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/active-players"
              ><FontAwesomeIcon :icon="faUsers" /> Active Players</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/last-games"
              ><FontAwesomeIcon :icon="faGamepad" /> Matches</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/current-status">
              <CustomIcon icon="wave-pulse" /> Activity</RouterLink
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              :class="{
                'router-link-active':
                  route.path.startsWith('/statistics') ||
                  route.path.startsWith('/player-statistics')
              }"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon :icon="faChartSimple" /> Statistics
            </a>
            <ul class="dropdown-menu" @click="closeDropdown">
              <li>
                <RouterLink class="dropdown-item" to="/statistics">
                  <FontAwesomeIcon :icon="faChartSimple" /> Global
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/player-statistics">
                  <FontAwesomeIcon :icon="faUser" /> Player
                </RouterLink>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              :class="{
                'router-link-active':
                  route.path.startsWith('/thread-health') || route.path.startsWith('/about')
              }"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon :icon="faFolderPlus" /> More
            </a>
            <ul class="dropdown-menu" @click="closeDropdown">
              <li>
                <a class="dropdown-item" aria-current="page" target="_blank" href="/api/">
                  <FontAwesomeIcon :icon="faFileText" /> Docs</a
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" aria-current="page" to="/thread-health">
                  <FontAwesomeIcon :icon="faHeartPulse" /> App Health</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" aria-current="page" to="/about">
                  <FontAwesomeIcon :icon="faInfoCircle" /> About</RouterLink
                >
              </li>
            </ul>
          </li>
        </ul>
        <KofiDonateComponent class="me-4 d-none d-lg-flex" />
        <ThemeManager />
      </div>
    </div>
  </nav>
  <div class="main">
    <!--- <div class="alert alert-warning" role="alert">
      <FontAwesomeIcon :icon="faCircleExclamation" /> Ranks might be incorrect until July 3rd as a
      fix to switch from 3v3 to 2v2 leaderboard was omitted the first few hours of the campaign.
    </div> --->
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
