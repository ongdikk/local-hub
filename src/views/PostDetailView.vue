<template>
  <Header />

  <AppContainer v-if="post">
    <article class="post">
      <h1 class="title">
        {{ post.title }}
      </h1>

      <div class="meta">
        <span> 👤 익명 </span>

        <span> 조회 {{ post.views }} </span>
      </div>

      <div class="divider"></div>

      <div class="content">
        {{ post.content }}
      </div>

      <div class="like">❤️ {{ post.likes }}</div>

      <div class="actions">
        <BaseButton @click="goBoard"> 목록 </BaseButton>

        <BaseButton @click="editPost"> 수정 </BaseButton>

        <BaseButton @click="deletePost"> 삭제 </BaseButton>
      </div>
    </article>
  </AppContainer>

  <PasswordModal
    :visible="showPasswordModal"
    :title="actionType === 'edit' ? '수정 비밀번호 확인' : '삭제 비밀번호 확인'"
    @confirm="confirmPassword"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'

import AppContainer from '@/components/common/AppContainer.vue'

import BaseButton from '@/components/common/BaseButton.vue'

import PasswordModal from '@/components/common/PasswordModal.vue'

import { useBoardStore } from '@/stores/board'

const router = useRouter()

const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

const showPasswordModal = ref(false)

const actionType = ref('')

onMounted(async () => {
  post.value = await boardStore.findPost(route.params.id)

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
}
</script>

<style scoped>
.card {
  background: white;

  border-radius: 18px;

  padding: 32px;

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 28px;

  font-weight: 700;

  margin-bottom: 18px;
}

.meta {
  display: flex;

  gap: 18px;

  color: #777;

  font-size: 14px;
}

.divider {
  height: 1px;

  background: #eee;

  margin: 24px 0;
}

.content {
  min-height: 250px;

  line-height: 1.8;

  white-space: pre-wrap;
}

.button-group {
  display: flex;

  gap: 12px;

  margin-top: 32px;
}

@media (max-width: 768px) {
  .card {
    padding: 20px;

    border-radius: 14px;
  }

  .title {
    font-size: 22px;
  }

  .button-group {
    flex-direction: column;
  }
}

/* .post {
  background: white;

  border-radius: 20px;

  padding: 32px;
}

.title {
  font-size: 28px;

  font-weight: 800;

  margin-bottom: 16px;
}

.meta {
  display: flex;

  gap: 15px;

  color: #8b95a1;

  font-size: 14px;
}

.divider {
  height: 1px;

  background: #eee;

  margin: 25px 0;
}

.content {
  min-height: 250px;

  line-height: 1.8;

  font-size: 16px;

  white-space: pre-wrap;
}

.like {
  margin-top: 30px;

  padding: 14px;

  background: #f7f8fa;

  border-radius: 12px;

  text-align: center;
}

.actions {
  display: flex;

  gap: 10px;

  margin-top: 30px;
} */
</style>
