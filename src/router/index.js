import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/graph',
    name: 'Graph',
    component: () => import(/* webpackChunkName: "graph" */ '../views/Graph.vue')
  },
  {
    path: '/selectable',
    name: 'Select',
    component: () => import(/* webpackChunkName: "select" */ '../views/Select.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import(/* webpackChunkName: "create" */ '../views/Create.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/sentence/:id',
    name: 'Sentence',
    component: () => import(/* webpackChunkName: "sentence" */ '../views/Sentence.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
