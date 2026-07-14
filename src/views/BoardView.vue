<template>
  <Header />

  <div class="container">
    <!-- 지역 타이틀 -->

    <section class="intro">
      <h1>LocalHub</h1>

      <p>구미·경북 지역 이야기를 공유해보세요.</p>
    </section>

    <!-- 검색 -->

    <input class="search" v-model="keyword" placeholder="🔍 지역 정보를 검색해보세요." />

    <!-- 게시글 영역 -->

    <section>
      <div class="section-title">최신 이야기</div>

      <PostList :posts="filteredPosts" />
    </section>

    <!-- 작성 버튼 -->

    <button class="write" @click="goWrite">✏️</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'

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
.container {
  max-width: 720px;

  margin: 40px auto;

  padding-bottom: 100px;
}

.intro {
  margin-bottom: 30px;
}

.intro h1 {
  font-size: 32px;

  font-weight: 800;

  margin-bottom: 8px;
}

.intro p {
  color: #6b7684;

  font-size: 15px;
}

.search {
  width: 100%;

  padding: 16px 20px;

  border: none;

  border-radius: 14px;

  background: white;

  font-size: 15px;

  margin-bottom: 30px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;

  font-weight: 700;

  margin-bottom: 16px;
}

.write {
  position: fixed;

  right: 40px;

  bottom: 40px;

  width: 64px;

  height: 64px;

  border: none;

  border-radius: 50%;

  background: #3182f6;

  color: white;

  font-size: 24px;

  cursor: pointer;

  box-shadow: 0 8px 20px rgba(49, 130, 246, 0.3);
}
</style>
