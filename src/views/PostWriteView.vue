<template>
  <Header />

  <AppContainer>
    <h2>게시글 작성</h2>

    <PostForm
      buttonText="등록하기"
      :showPassword="true"
      @submit="submitPost"
      @cancel="cancel"
    />
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
  console.log('PostWriteView submitPost 실행', data)
  await boardStore.addPost(data)

  router.push('/board')
}

function cancel() {
  router.back()
}
</script>