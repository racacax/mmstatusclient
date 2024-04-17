import { createRouter, createWebHashHistory } from 'vue-router'
import ActivePlayersView from '@/views/ActivePlayersView.vue'
import LastGamesView from '@/views/LastGamesView.vue'
import StatusView from '@/views/StatusView.vue'
import StatisticsView from '@/views/StatisticsView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'status' }
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
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView
    },
    {
      path: '/statistics/:playerId',
      name: 'statistics-id',
      component: StatisticsView
    }
  ]
})

export default router
