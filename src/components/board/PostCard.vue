<template>
  <article class="card" @click="goDetail">
    <div class="header">
      <div class="profile">
        <div class="avatar">👤</div>

        <div>
          <div class="writer">
            {{ post.author ?? '익명' }}
          </div>

          <div class="time">
            {{ formatDate(post.created_at ?? post.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <h3 class="title">
      {{ post.title }}
    </h3>

    <div v-if="post.tags?.length" class="tags">
      <span v-for="tag in post.tags" :key="tag" class="tag"> #{{ tag }} </span>
    </div>

    <p class="content">
      {{ post.content }}
    </p>

    <div class="footer">
      <span>❤️ {{ post.likes ?? 0 }}</span>

      <span>💬 {{ post.commentCount ?? 0 }}</span>

      <span>🔖 {{ post.bookmarks ?? 0 }}</span>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatRelative } from '@/utils/date'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

function goDetail() {
  router.push(`/post/${props.post.id}`)
}

function formatDate(date) {
  if (!date) return ''

  return formatRelative(date)
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.profile {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f2f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.writer {
  font-weight: 600;
}

.time {
  font-size: 12px;
  color: #8b95a1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 22px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef5ff;
  color: #3182f6;
  font-size: 12px;
  font-weight: 600;
}

.title {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 12px;
}

.content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 18px;
}

.footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 14px;
  display: flex;
  gap: 18px;
  color: #8b95a1;
}

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .title {
    font-size: 17px;
  }

  .content {
    font-size: 14px;
  }

  .footer {
    gap: 12px;
    padding-top: 12px;
    flex-wrap: wrap;
  }
}
</style>
