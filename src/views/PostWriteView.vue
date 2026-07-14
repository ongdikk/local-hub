<template>
  <Header />

  <div class="container">
    <h2>게시글 작성</h2>

    <PostForm :showPassword="true" buttonText="등록하기" @submit="submitPost" @cancel="cancel" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'

import PostForm from '@/components/board/PostForm.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const boardStore = useBoardStore()

async function submitPost(data) {
  const result = await boardStore.addPost(data)

  if (result) {
    router.push('/board')
  }
}

function cancel() {
  router.back()
}
</script>

<style scoped>
.container {
  max-width: 720px;

  margin: 40px auto;
}
</style>
