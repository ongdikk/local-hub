<template>
  <Header />

  <div class="container">
    <h2>게시글 작성</h2>

    <select v-model="form.category" class="category">
      <option disabled value="">카테고리 선택</option>

      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>

    <BaseInput v-model="form.title" placeholder="제목" />

    <textarea v-model="form.content" class="content" placeholder="내용을 입력하세요."></textarea>

    <BaseInput v-model="form.password" type="password" placeholder="수정 비밀번호" />

    <BaseButton @click="submitPost"> 등록하기 </BaseButton>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'

import BaseInput from '@/components/common/BaseInput.vue'

import BaseButton from '@/components/common/BaseButton.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const boardStore = useBoardStore()

const categories = ['맛집', '관광', '생활', '질문']

const form = reactive({
  title: '',

  content: '',

  category: '',

  password: '',
})

async function submitPost() {
  if (!form.category) {
    alert('카테고리를 선택해주세요.')

    return
  }

  await boardStore.addPost({
    title: form.title,

    content: form.content,

    category: form.category,

    password: form.password,

    author: '익명',

    createdAt: new Date().toISOString(),

    commentCount: 0,
  })

  router.push('/board')
}
</script>

<style scoped>
.container {
  width: 900px;

  margin: 50px auto;

  display: flex;

  flex-direction: column;

  gap: 20px;
}

.category {
  padding: 14px;

  border-radius: 10px;

  border: 1px solid #ddd;

  font-size: 15px;

  background: white;
}

.content {
  min-height: 220px;

  padding: 15px;

  resize: none;

  border-radius: 10px;

  border: 1px solid #ddd;

  font-size: 15px;
}

@media (max-width: 768px) {
  .container {
    width: auto;

    margin: 30px 20px;
  }
}
</style>
