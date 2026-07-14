<template>
  <Header />

  <AppContainer>
    <CategoryTabs @change="changeCategory" />

    <input
      class="search"
      :value="keyword"
      @input="keyword = $event.target.value"
      placeholder="🔍 지역 정보를 검색해보세요."
    />

    <PostList :posts="filteredPosts" />

    <WriteButton />

    <ChatButton />
  </AppContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import Header from '@/components/common/Header.vue'

import AppContainer from '@/components/common/AppContainer.vue'

import PostList from '@/components/board/PostList.vue'

import { useBoardStore } from '@/stores/board'

import CategoryTabs from '@/components/board/CategoryTabs.vue'

import WriteButton from '@/components/common/WriteButton.vue'

import ChatButton from '@/components/common/ChatButton.vue'

const boardStore = useBoardStore()

const keyword = ref('')

const selectedCategory = ref('전체')

onMounted(() => {
  boardStore.loadPosts()
})

const filteredPosts = computed(() => {
  const search = keyword.value.trim().toLowerCase()

  return boardStore.posts.filter((post) => {
    const matchCategory =
      selectedCategory.value === '전체' || post.category === selectedCategory.value

    const matchSearch = post.title.toLowerCase().includes(search)

    return matchCategory && matchSearch
  })
})

// const filteredPosts = computed(() => {
//   const search = keyword.value.trim().toLowerCase()

//   if (!search) {
//     return boardStore.posts
//   }

//   return boardStore.posts.filter((post) => {
//     return post.title.toLowerCase().includes(search) || post.content.toLowerCase().includes(search)
//   })
// })

function changeCategory(category) {
  selectedCategory.value = category
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
