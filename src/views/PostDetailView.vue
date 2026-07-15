<template>
  <Header />

  <div class="container" v-if="post">
    <div class="top-actions-row">
      <div class="top-left">
        <BaseButton @click="goBoard">목록</BaseButton>
      </div>

      <div class="top-right">
        <BaseButton @click="editPost">수정</BaseButton>
        <BaseButton @click="deletePost">삭제</BaseButton>
      </div>
    </div>

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

      <!-- 버튼: 상단으로 이동 -->
    </article>

    <!-- 액션 영역 -->

    <div class="action-bar">
      <div class="left-actions">
        <div class="action-item" @click="likePost" :class="{ active: liked }">
          {{ liked ? '❤️ 좋아요 취소' : '🤍 좋아요' }}
          {{ post.likes }}
        </div>

        <div class="divider-vertical"></div>

        <div class="action-item" @click="bookmarkPost" :class="{ active: bookmarked }">
          {{ bookmarked ? '🔖 저장 취소' : '📑 저장' }}
          {{ post.bookmarks }}
        </div>
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
import { parseToLocalDate } from '@/utils/date'

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

const bookmarked = ref(false)

onMounted(async () => {
  post.value = await boardStore.findPost(route.params.id)

  if (!post.value) {
    router.push('/board')
    return
  }

  liked.value = post.value.likes > 0

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
  console.log('confirmPassword - action:', actionType.value, 'password:', password)

  // 삭제의 경우 서버가 DELETE /api/posts/{id}에 { password }를 요구하므로 바로 호출
  if (actionType.value === 'delete') {
    const success = await boardStore.removePost(route.params.id, String(password))

    if (!success) {
      alert('비밀번호가 일치하지 않거나 삭제에 실패했습니다.')

      return
    }

    closeModal()

    router.push('/board')

    return
  }

  // 수정은 검증 엔드포인트가 없을 수 있으므로 편의상 바로 편집 페이지로 이동
  if (actionType.value === 'edit') {
    closeModal()

    router.push(`/edit/${route.params.id}`)
  }
}

function closeModal() {
  showPasswordModal.value = false
}

async function likePost() {
  const previous = post.value.likes

  liked.value = !liked.value

  // 즉시 UI 변경
  post.value.likes += liked.value ? 1 : -1

  const success = await boardStore.toggleLike(route.params.id, liked.value)

  // 실패 시 복구
  if (!success) {
    post.value.likes = previous

    liked.value = !liked.value
  }
}

async function bookmarkPost() {
  const previousFlag = bookmarked.value
  const previousCount = post.value.bookmarks || 0

  // UI 즉시 변경 (optimistic)
  bookmarked.value = !bookmarked.value
  post.value.bookmarks = previousCount + (bookmarked.value ? 1 : -1)

  const result = await boardStore.toggleBookmark(route.params.id)

  // 실패하면 원상복구
  if (!result) {
    bookmarked.value = previousFlag
    post.value.bookmarks = previousCount
  } else {
    // 서버 기준 상태 반영 (서버가 전체 카운트를 제공하면 사용)
    if (typeof result.bookmarks === 'number') {
      post.value.bookmarks = result.bookmarks
    }

    bookmarked.value = !!result.bookmarked
  }
}

function formatDate(date) {
  if (!date) {
    return ''
  }
  const d = parseToLocalDate(date)

  return d ? d.toLocaleString() : ''
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

.top-actions-row {
  max-width: 900px;
  margin: 16px auto 0;
  padding: 0 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-right {
  display: flex;
  gap: 8px;
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
