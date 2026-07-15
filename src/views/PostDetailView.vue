<template>
  <Header />

  <div class="container" v-if="post">
    <article class="card">
      <!-- 카테고리 -->

      <div v-if="post.tags?.length" class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag"> #{{ tag }} </span>
      </div>

      <!-- 작성자 영역 -->

      <div class="profile">
        <div class="avatar">👤</div>

        <div class="profile-info">
          <div class="author">익명</div>

          <div class="date">
            {{ formatDate(post.created_at) }}
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

      <div v-if="post.image_urls?.length" class="images">
        <img v-for="image in post.image_urls" :key="image" :src="image" class="image" />
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
      <div class="left-actions">
        <div class="action-item" @click="likePost" :class="{ active: liked }">
          {{ liked ? '❤️ 좋아요 취소' : '🤍 좋아요' }}
          {{ post.likes }}
        </div>

        <!-- <button class="like" :class="{ active: liked }" @click="likePost">
          {{ liked ? '❤️ 좋아요 취소' : '🤍 좋아요' }}
          {{ post.likes }}
        </button> -->

        <div class="divider-vertical"></div>

        <div class="action-item" @click="bookmarkPost" :class="{ active: bookmarked }">
          {{ bookmarked ? '🔖 저장 취소' : '📑 저장' }}
          {{ post.bookmarks }}
        </div>

        <!-- <button class="bookmark" :class="{ active: bookmarked }" @click="bookmarkPost">
          {{ bookmarked ? '🔖 저장 취소' : '📑 저장' }}
          {{ post.bookmarks }}
        </button> -->
      </div>

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

const bookmarked = ref(false)

// onMounted(async () => {
//   post.value = await boardStore.findPost(route.params.id)

//   if (!post.value) {
//     router.push('/board')
//   }

//   await commentStore.loadComments(route.params.id)
// })
onMounted(async () => {
  // await boardStore.increaseView(route.params.id)

  post.value = await boardStore.fetchPost(route.params.id)

  if (!post.value) {
    router.push('/board')
    return
  }

  await commentStore.loadComments(route.params.id)
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
}

async function likePost() {
  liked.value = !liked.value

  const success = await boardStore.toggleLike(route.params.id)

  if (success) {
    post.value = await boardStore.findPost(route.params.id)
  }
}

async function bookmarkPost() {
  bookmarked.value = !bookmarked.value

  const success = await boardStore.toggleBookmark(route.params.id, bookmarked.value)

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
  padding: 0 32px;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* ---------- 작성자 ---------- */

.profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 42px;
  height: 42px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: #f2f4f6;

  font-size: 20px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.author {
  font-size: 15px;
  font-weight: 600;
}

.date {
  margin-top: 3px;

  font-size: 13px;

  color: #8b95a1;
}

/* ---------- 제목 ---------- */

.title {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.4;

  margin-bottom: 16px;
}

/* ---------- 태그 ---------- */

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 24px;
}

.tag {
  padding: 6px 12px;

  border-radius: 999px;

  background: #eef6ff;

  color: #3182f6;

  font-size: 13px;

  font-weight: 600;
}

/* ---------- 본문 ---------- */

.content {
  min-height: 250px;

  line-height: 1.8;

  font-size: 16px;

  white-space: pre-wrap;
}

/* ---------- 이미지 ---------- */

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 20px;
}

.image {
  width: 180px;

  border-radius: 12px;
}

/* ---------- 구분선 ---------- */

.divider {
  height: 1px;

  margin: 24px 0;

  background: #e5e7eb;
}

/* ---------- 버튼 ---------- */

.button-group {
  display: flex;
  gap: 12px;
}

/* ---------- 액션바 ---------- */

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 28px 0;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right-info {
  display: flex;
  align-items: center;
  gap: 18px;

  color: #666;

  font-size: 14px;

  font-weight: 600;
}

/* ---------- 좋아요 / 북마크 ---------- */

.like,
.bookmark {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  height: 42px;

  padding: 0 18px;

  border: 1px solid #ddd;
  border-radius: 999px;

  background: white;

  cursor: pointer;

  font-size: 14px;

  line-height: 1;

  transition: all 0.2s ease;
}

.like:hover,
.bookmark:hover {
  background: #f8f8f8;
}

.like.active {
  background: #fee2e2;
  border-color: #fecaca;
}

.bookmark.active {
  background: #eef6ff;
  border-color: #3182f6;
  color: #3182f6;
}

.action-item {
  display: flex;
  align-items: center;

  cursor: pointer;

  color: #555;

  font-size: 14px;

  font-weight: 600;

  transition: 0.2s;
}

.action-item:hover {
  color: #3182f6;
}

.divider-vertical {
  width: 1px;
  height: 18px;

  background: #d1d5db;
}

/* ---------- 댓글 수 ---------- */

.comment-count {
  display: flex;
  align-items: center;

  height: 42px;

  font-size: 14px;

  color: #666;

  font-weight: 600;

  line-height: 1;
}

/* ---------- 반응형 ---------- */

@media (max-width: 768px) {
  .container {
    margin: 20px;
  }

  .card {
    padding: 22px;
  }

  .title {
    font-size: 22px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .left-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .right-info {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
