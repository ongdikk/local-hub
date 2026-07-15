<template>
  <Header />

  <AppContainer>
    <div class="write-top-row">
      <div class="write-title">게시글 작성</div>

      <span
        class="back-text"
        role="button"
        tabindex="0"
        @click="cancel"
        @keydown.enter.space="cancel"
        aria-label="뒤로가기"
      >
        뒤로가기
      </span>
    </div>

    <div class="write-card">
      <PostForm buttonText="등록하기" :showPassword="true" @submit="submitPost" @cancel="cancel" />
    </div>
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
  const postId = await boardStore.addPost(data)

  if (postId) {
    router.push(`/post/${postId}`)
  } else {
    alert('게시글 등록에 실패했습니다.')
  }
}

function cancel() {
  router.back()
}
</script>

<style scoped>
.write-top-row {
  max-width: 900px;
  margin: 24px auto 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.write-title {
  font-size: 20px;
  font-weight: 800;
}

.back-text {
  display: inline-block;
  background: white;
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(2, 6, 23, 0.06);
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background 0.12s ease;
}

.back-text:hover,
.back-text:focus {
  transform: translateY(-2px);
  background: #f8fafc;
}

.write-card {
  max-width: 900px;
  margin: 0 auto 40px;
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
}

/* Tidy PostForm inside */
.write-card .form {
  padding: 0;
}

@media (max-width: 768px) {
  .write-top-row {
    padding: 0 20px;
    margin: 18px auto 8px;
  }

  .write-card {
    padding: 18px;
    margin: 0 auto 24px;
  }
}
</style>
