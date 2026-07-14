<template>
  <Header />

  <AppContainer>
    <input
      class="search"
      :value="keyword"
      @input="keyword = $event.target.value"
      placeholder="🔍 지역 정보를 검색해보세요."
    />

    <PostList :posts="filteredPosts" />

    <button class="write" @click="goWrite">
      <span class="icon"> ✎ </span>

      <span> 글쓰기 </span>
    </button>
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
  const search = keyword.value.trim().toLowerCase()

  if (!search) {
    return boardStore.posts
  }

  return boardStore.posts.filter((post) => {
    return post.title.toLowerCase().includes(search) || post.content.toLowerCase().includes(search)
  })
})

function goWrite() {
  router.push('/write')
}
</script>

<style scoped>
.search {
  width: 100%;

  height: 54px;

  padding: 0 20px;

  border-radius: 16px;

  background: #f5f6f8;

  font-size: 15px;

  box-sizing: border-box;

  transition: 0.2s;

  margin-bottom: 30px;
}

.search::placeholder {
  color: #9ca3af;
}

.search:focus {
  outline: none;

  border-color: #3182f6;

  box-shadow: 0 0 0 3px rgba(49, 130, 246, 0.12);
}

.write {
  position: fixed;

  left: 50%;

  bottom: 32px;

  transform: translateX(-50%);

  height: 52px;

  padding: 0 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border: none;

  border-radius: 26px;

  background: #3182f6;

  color: white;

  font-size: 15px;

  font-weight: 600;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);

  cursor: pointer;

  transition: 0.2s;
}

.write:hover {
  transform: translateX(-50%) translateY(-3px);
}

.icon {
  font-size: 18px;

  font-weight: bold;
}

@media (max-width: 768px) {
  .write {
    bottom: 20px;

    height: 48px;

    padding: 0 22px;

    font-size: 14px;
  }
}
</style>
