<template>
  <Header />

  <AppContainer>
    <input class="search" v-model="keyword" placeholder="🔍 지역 정보를 검색해보세요." />

    <PostList :posts="filteredPosts" />

    <button class="write" @click="goWrite">+</button>
  </AppContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'

import AppContainer from '@/components/common/AppContainer.vue'

import PostList from '@/components/board/PostList.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const boardStore = useBoardStore()

const keyword = ref('')

onMounted(() => {
  boardStore.loadPosts()
})

const filteredPosts = computed(() => {
  return boardStore.posts.filter((post) => post.title.includes(keyword.value))
})

function goWrite() {
  router.push('/write')
}
</script>

<style scoped>
.search {
  width: 100%;

  height: 52px;

  padding: 0 18px;

  border: none;

  border-radius: 16px;

  background: #f5f6f8;

  font-size: 15px;

  box-sizing: border-box;

  margin-bottom: 30px;
}

.search:focus {
  outline: 2px solid #3182f6;
}

.write {
  position: fixed;

  right: 30px;

  bottom: 30px;

  width: 60px;

  height: 60px;

  border: none;

  border-radius: 50%;

  background: #3182f6;

  color: white;

  font-size: 32px;

  cursor: pointer;
}

@media (max-width: 768px) {
  .write {
    right: 20px;

    bottom: 20px;

    width: 54px;

    height: 54px;

    font-size: 28px;
  }
}
</style>
