import { createRouter, createWebHistory } from 'vue-router'

import BoardView from '@/views/BoardView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostWriteView from '@/views/PostWriteView.vue'
import PostEditView from '@/views/PostEditView.vue'
import AdminView from '@/views/AdminView.vue'

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

    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },

  ],

  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

export default router
