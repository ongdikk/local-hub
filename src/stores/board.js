import { defineStore } from 'pinia'

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  checkPassword,
  toggleLike,
} from '@/services/boardApi'

export const useBoardStore = defineStore(
  'board',

  {
    state: () => ({
      posts: [],
    }),

    actions: {
      // 게시글 목록 조회

      async loadPosts() {
        const response = await getPosts()

        if (response.success) {
          this.posts = response.data
        }
      },

      // 게시글 작성

      // async addPost(post) {
      //   const response = await createPost(post)

      //   if (!response.success) {
      //     return false
      //   }

      //   this.posts.unshift(response.data)

      //   return true
      // },

      async addPost(post) {
        const response = await createPost(post)

        // API 연결 시 삭제
        return response.data

        // 삭제 후
        // this.posts.unshift(response.data) 추가
      },

      // 게시글 상세 조회

      async findPost(id) {
        return this.posts.find((post) => post.id === Number(id))
      },

      // 게시글 수정

      async updatePost(id, form) {
        const response = await updatePost(
          id,

          form,
        )

        if (!response.success) {
          return false
        }

        const index = this.posts.findIndex((post) => post.id === Number(id))

        if (index !== -1) {
          this.posts[index] = response.data
        }

        return true
      },

      // 게시글 삭제

      async removePost(id) {
        const response = await deletePost(id)

        if (!response.success) {
          return false
        }

        this.posts = this.posts.filter((post) => post.id !== Number(id))

        return true
      },

      // 비밀번호 확인

      async checkPostPassword(id, password) {
        const response = await checkPassword(
          id,

          password,
        )

        if (!response.success) {
          return false
        }

        return response.data
      },

      async toggleLike(id, liked) {
        const response = await toggleLike(id, liked)

        if (!response) {
          return false
        }

        const index = this.posts.findIndex((post) => post.id === Number(id))

        if (index !== -1) {
          this.posts[index] = response.data
        }

        return true
      },
    },
  },
)
