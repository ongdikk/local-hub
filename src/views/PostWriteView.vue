<template>
  <Header />

  <AppContainer>
    <h2>게시글 작성</h2>

    <PostForm buttonText="등록하기" :showPassword="true" @submit="submitPost" @cancel="cancel" />
  </AppContainer>
</template>

<script setup>
import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'
import AppContainer from '@/components/common/AppContainer.vue'
import PostForm from '@/components/board/PostForm.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const boardStore = useBoardStore()

async function submitPost(data) {
  console.log('PostWriteView 데이터:', data)
  console.log('PostWriteView submitPost 실행', data)
  const postId = await boardStore.addPost(data)

  if (postId) {
    router.push(`/post/${postId}`)
  } else {
    alert('게시글 등록에 실패했습니다.')
  }
}

function cancel() {
  router.back()
}
</script>
