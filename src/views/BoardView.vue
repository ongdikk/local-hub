<template>
  <Header />

  <AppContainer>
    <CategoryTabs @change="changeTag" />

    <input
      v-model="keyword"
      @input="testInput"
      class="search"
      placeholder="🔍 지역 정보를 검색해보세요."
    />

    <!-- <PostList :posts="filteredPosts" /> -->
     <PostList :posts="boardStore.posts" />

    <WriteButton />

    <ChatButton :opened="showChat" @toggle="showChat = !showChat"/>

    <ChatWindow v-if="showChat" @close="showChat=false"/>
  </AppContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import Header from '@/components/common/Header.vue'
import AppContainer from '@/components/common/AppContainer.vue'
import PostList from '@/components/board/PostList.vue'
import CategoryTabs from '@/components/board/CategoryTabs.vue'
import WriteButton from '@/components/common/WriteButton.vue'
import ChatButton from '@/components/common/ChatButton.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import { useBoardStore } from '@/stores/board'

const boardStore = useBoardStore()

const keyword = ref('')

const selectedTag = ref('전체')

const showChat = ref(false)

onMounted(() => {
  loadPosts()
  // boardStore.loadPosts()
})

// const filteredPosts = computed(() => {
//   const search = keyword.value.trim().toLowerCase()

//   return boardStore.posts.filter((post) => {
//     const matchTag =
//       selectedTag.value === '전체' ||
//       post.tags?.includes(selectedTag.value)

//     const matchSearch =
//       post.title.toLowerCase().includes(search) ||
//       post.content.toLowerCase().includes(search)

//     return matchTag && matchSearch
//   })
// })

async function loadPosts() {
  console.log('검색 요청:', keyword.value)

  await boardStore.loadPosts({
    keyword: keyword.value,
    tag: selectedTag.value,
  })

  console.log('결과:', boardStore.posts)
}

function changeTag(tag) {
  selectedTag.value = tag

  loadPosts()
}

watch(keyword, (value, oldValue) => {
  console.log('watch 실행:', oldValue, '→', value)
  loadPosts()
})
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