import { createRouter, createWebHistory } from 'vue-router'
import ActivePlayersView from "@/views/ActivePlayersView.vue";
import LastGamesView from "@/views/LastGamesView.vue";
import StatusView from "@/views/StatusView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ActivePlayersView
    },
    {
      path: '/active-players',
      name: 'status',
      component: ActivePlayersView
    },
    {
      path: '/last-games',
      name: 'last',
      component: LastGamesView
    },
    {
      path: '/current-status',
      name: 'current-status',
      component: StatusView
    },
  ]
})

export default router
