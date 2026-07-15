<template>
  <Header />

  <AppContainer>
    <CategoryTabs @change="changeCategory" />

    <input
      v-model="keyword"
      class="search"
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
import CategoryTabs from '@/components/board/CategoryTabs.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import ChatButton from '@/components/common/ChatButton.vue'

import { useBoardStore } from '@/stores/board'

const boardStore = useBoardStore()

const keyword = ref('')

const selectedTag = ref('전체')

onMounted(() => {
  boardStore.loadPosts()
})

const filteredPosts = computed(() => {
  const search = keyword.value.trim().toLowerCase()

  return boardStore.posts.filter((post) => {
    const matchTag =
      selectedTag.value === '전체' ||
      post.tags?.includes(selectedTag.value)

    const matchSearch =
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search)

    return matchTag && matchSearch
  })
})

function changeCategory(tag) {
  selectedTag.value = tag
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
  margin-bottom: 30px;
  box-sizing: border-box;
}

.search:focus {
  outline: none;
  border-color: #3182f6;
  box-shadow: 0 0 0 3px rgba(49,130,246,.12);
}

.search::placeholder {
  color: #9ca3af;
}
</style>