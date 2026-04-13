import { createRouter, createWebHashHistory } from 'vue-router'
import ActivePlayersView from '@/views/ActivePlayersView.vue'
import LastGamesView from '@/views/LastGamesView.vue'
import MatchView from '@/views/MatchView.vue'
import StatusView from '@/views/StatusView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import PlayerStatisticsView from '@/views/PlayerStatisticsView.vue'
import ThreadHealthView from '@/views/ThreadHealthView.vue'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView
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
      path: '/statistics/tab/:tabName',
      name: 'statistics-tab',
      component: StatisticsView
    },
    {
      path: '/statistics/:playerId',
      name: 'statistics-id',
      component: StatisticsView
    },
    {
      path: '/player-statistics',
      name: 'player-statistics',
      component: PlayerStatisticsView
    },
    {
      path: '/player-statistics/:playerId',
      name: 'player-statistics-id',
      component: PlayerStatisticsView
    },
    {
      path: '/match/:matchId',
      name: 'match',
      component: MatchView
    },
    {
      path: '/thread-health',
      name: 'thread-health',
      component: ThreadHealthView
    }
  ]
})

export default router
