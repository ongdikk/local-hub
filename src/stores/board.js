import { defineStore } from 'pinia'

import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  checkPassword,
  toggleLike,
  toggleBookmark,
  // increaseView,
} from '@/services/boardApi'

export const useBoardStore = defineStore(
  'board',

  {
    state: () => ({
      posts: [],
    }),

    actions: {
      // 게시글 목록 조회
      async loadPosts(params = {}) {
        const response = await getPosts(params)

        console.log('store response:', response)

        if (response.success) {
          this.posts = response.data
        }
      },

      // 게시글 작성
      async addPost(post) {
        const response = await createPost(post)

        if (!response.success) {
          return null
        }

        // API가 { post_id: number } 형태로 반환한다고 가정
        const postId = response.data?.post_id ?? response.data?.postId ?? response.data?.id

        return postId
      },

      // 게시글 상세 조회
      // async findPost(id) {
      //   return this.posts.find((post) => post.id === Number(id))
      // },
      async findPost(id) {
        const response = await getPostById(id)

        if (!response.success) {
          return null
        }

        return response.data
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

      // 좋아요 토글
      async toggleLike(id, liked) {
        const response = await toggleLike(id, liked)

        if (!response.success) {
          return false
        }

        return true
      },

      // 북마크 토글
      async toggleBookmark(id) {
        const response = await toggleBookmark(id)

        if (!response.success) {
          return false
        }

        // 서버 응답에 bookmarked(boolean) 와 optional bookmarks(count) 이 온다고 가정
        const data = response.data

        // posts 배열에 변경 사항 반영해서 목록에서 유지되게 함
        const index = this.posts.findIndex((post) => post.id === Number(id))

        if (index !== -1) {
          // bookmarked 플래그가 없을 수 있으니 설정
          const current = this.posts[index]

          // 만약 서버가 전체 카운트를 반환하면 사용, 아니면 플래그 기준으로 증감
          if (typeof data.bookmarks === 'number') {
            current.bookmarks = data.bookmarks
          } else if (typeof data.bookmarked === 'boolean') {
            current.bookmarks = (current.bookmarks || 0) + (data.bookmarked ? 1 : -1)
            if (current.bookmarks < 0) current.bookmarks = 0
          }

          current.bookmarked = !!data.bookmarked
          this.posts.splice(index, 1, { ...current })
        }

        return data
      },
    },
  },
)
