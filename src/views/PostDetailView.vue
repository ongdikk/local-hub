<template>
  <Header />

  <div class="container" v-if="post">
    <article class="card">
      <!-- 카테고리 -->

      <div class="category">
        {{ post.category }}
      </div>

      <!-- 작성자 영역 -->

      <div class="profile">
        <div class="avatar">👤</div>

        <div class="profile-info">
          <div class="author">
            {{ post.author ?? '익명' }}
          </div>

          <div class="date">
            {{ formatDate(post.createdAt) }}
          </div>
        </div>
      </div>

      <!-- 제목 -->
      <h1 class="title">
        {{ post.title }}
      </h1>

      <!-- 내용 -->
      <div class="content">
        {{ post.content }}
      </div>

      <div class="divider"></div>

      <!-- 버튼 -->
      <div class="button-group">
        <BaseButton @click="goBoard"> 목록 </BaseButton>

        <BaseButton @click="editPost"> 수정 </BaseButton>

        <BaseButton @click="deletePost"> 삭제 </BaseButton>
      </div>
    </article>

    <!-- 액션 영역 -->

    <div class="action-bar">
      <button class="like" :class="{ active: liked }" @click="likePost">
        {{ liked ? '❤️ 좋아요 취소' : '🤍 좋아요' }}
        {{ post.likes }}
      </button>

      <div class="comment-count">💬 댓글 {{ commentStore.comments.length }}</div>
    </div>

    <div class="divider"></div>

    <CommentList :comments="commentStore.comments" />

    <CommentInput @submit="addComment" />
  </div>

  <PasswordModal
    :visible="showPasswordModal"
    :title="actionType === 'edit' ? '수정 비밀번호 확인' : '삭제 비밀번호 확인'"
    @confirm="confirmPassword"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import Header from '@/components/common/Header.vue'

import BaseButton from '@/components/common/BaseButton.vue'

import PasswordModal from '@/components/common/PasswordModal.vue'

import { useBoardStore } from '@/stores/board'

import CommentList from '@/components/comment/CommentList.vue'

import CommentInput from '@/components/comment/CommentInput.vue'

import { useCommentStore } from '@/stores/comment'

const router = useRouter()

const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

const showPasswordModal = ref(false)

const actionType = ref('')

const commentStore = useCommentStore()

const liked = ref(false)

onMounted(async () => {
  post.value = await boardStore.findPost(route.params.id)

  await commentStore.loadComments(route.params.id)

  if (!post.value) {
    router.push('/board')
  }
})

function goBoard() {
  router.push('/board')
}

function editPost() {
  actionType.value = 'edit'

  showPasswordModal.value = true
}

function deletePost() {
  actionType.value = 'delete'

  showPasswordModal.value = true
}

async function confirmPassword(password) {
  const result = await boardStore.checkPostPassword(
    route.params.id,

    password,
  )

  if (!result) {
    alert('비밀번호가 일치하지 않습니다.')

    return
  }

  closeModal()

  if (actionType.value === 'edit') {
    router.push(`/edit/${route.params.id}`)
  }

  if (actionType.value === 'delete') {
    await boardStore.removePost(route.params.id)

    router.push('/board')
  }
}

function closeModal() {
  showPasswordModal.value = false

  actionType.value = ''
}

async function likePost() {
  // alert('좋아요 기능 준비중')

  liked.value = !liked.value

  const success = await boardStore.toggleLike(
    route.params.id,

    liked.value,
  )

  if (success) {
    post.value = await boardStore.findPost(route.params.id)
  }
}

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleString()
}

async function addComment(content) {
  await commentStore.addComment({
    postId: Number(route.params.id),

    content,
  })
}
</script>

<style scoped>
.container {
  max-width: 900px;

  margin: 40px auto;
}

.card {
  background: white;

  border-radius: 20px;

  padding: 32px;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.category {
  display: inline-block;

  background: #eef4ff;

  color: #3182f6;

  padding: 6px 12px;

  border-radius: 14px;

  font-size: 13px;

  font-weight: 600;

  margin-bottom: 16px;
}

.title {
  font-size: 26px;

  font-weight: 800;

  line-height: 1.4;

  margin-bottom: 20px;
}

.meta {
  display: flex;

  gap: 15px;

  color: #8b95a1;

  font-size: 14px;
}

.stats {
  margin-top: 16px;

  display: flex;

  gap: 18px;

  font-size: 14px;

  color: #555;
}

.divider {
  height: 1px;

  background: #e5e7eb;

  margin: 24px 0;
}

.content {
  min-height: 250px;

  line-height: 1.8;

  font-size: 16px;

  white-space: pre-wrap;
}

.like {
  margin-top: 25px;

  padding: 12px 20px;

  border-radius: 20px;

  border: 1px solid #ddd;

  background: white;

  cursor: pointer;
}

.button-group {
  display: flex;

  gap: 12px;
}

@media (max-width: 768px) {
  .container {
    margin: 20px;
  }

  .card {
    padding: 22px;
  }

  .title {
    font-size: 24px;
  }
}

.profile {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 20px;
}

.avatar {
  width: 42px;

  height: 42px;

  border-radius: 50%;

  background: #f2f4f6;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;
}

.profile-info {
  display: flex;

  flex-direction: column;
}

.author {
  font-weight: 600;

  font-size: 15px;
}

.date {
  font-size: 13px;

  color: #8b95a1;

  margin-top: 3px;
}

.action-bar {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin: 25px 0;
}

.like {
  padding: 10px 18px;

  border-radius: 20px;

  border: 1px solid #ddd;

  background: white;

  cursor: pointer;

  font-size: 14px;
}

.like:hover {
  background: #f8f8f8;
}

.comment-count {
  color: #555;

  font-size: 14px;

  font-weight: 600;
}

.like.active {
  background: #fee2e2;

  border-color: #fecaca;
}
</style>
