<template>
  <Header />

  <AppContainer>
    <h2>게시글 수정</h2>

    <PostForm :initialData="post" buttonText="수정하기" @submit="update" @cancel="cancel" />
  </AppContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import Header from '@/components/common/Header.vue'

import AppContainer from '@/components/common/AppContainer.vue'

import PostForm from '@/components/board/PostForm.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

onMounted(async () => {
  post.value = await boardStore.findPost(route.params.id)

  if (!post.value) {
    router.push('/board')
  }
})

async function update(data) {
  const result = await boardStore.updatePost(
    route.params.id,

    data,
  )

  if (result) {
    router.push(`/post/${route.params.id}`)
  }
}

function cancel() {
  router.back()
}
</script>
