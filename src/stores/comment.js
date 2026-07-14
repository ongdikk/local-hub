import { defineStore } from 'pinia'

import { getComments, createComment } from '@/services/commentApi'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [],
  }),

  actions: {
    async loadComments(postId) {
      this.comments = await getComments(postId)
    },

    async addComment(data) {
      const comment = await createComment(data)

      this.comments.push(comment)
    },
  },
})
