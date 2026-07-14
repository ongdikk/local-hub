import { createRouter, createWebHistory } from 'vue-router'

import BoardView from '@/views/BoardView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostWriteView from '@/views/PostWriteView.vue'
import PostEditView from '@/views/PostEditView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/board',
    },

    {
      path: '/board',
      component: BoardView,
    },

    {
      path: '/post/:id',
      component: PostDetailView,
    },

    {
      path: '/write',
      component: PostWriteView,
    },

    {
      path: '/edit/:id',
      component: PostEditView,
    },
  ],
})

export default router
