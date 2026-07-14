<template>
  <Header />

  <div class="container">
    <h2>게시글 수정</h2>

    <PostForm :initialData="post" buttonText="수정하기" @submit="update" @cancel="cancel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import Header from '@/components/common/Header.vue'

import PostForm from '@/components/board/PostForm.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

onMounted(async () => {
  const data = await boardStore.findPost(route.params.id)

  if (!data) {
    router.push('/board')

    return
  }

  post.value = data
})

async function update(data) {
  const result = await boardStore.updatePost(
    route.params.id,

    data,
  )

  if (!result) {
    alert('수정 실패')

    return
  }

  router.push(`/post/${route.params.id}`)
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
