<template>
  <section class="comments">
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <div class="profile">
        <div class="avatar">👤</div>

        <div>
          <div class="author">
            {{ comment.author ?? '익명' }}
          </div>

          <div class="date">
            {{ formatDate(comment.created_at) }}
          </div>
        </div>
      </div>

      <div class="content">
        {{ comment.content }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { parseToLocalDate } from '@/utils/date'

defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
})
function formatDate(date) {
  if (!date) return ''

  const d = parseToLocalDate(date)

  return d ? d.toLocaleString() : ''
}
</script>

<style scoped>
.comments {
  margin-top: 40px;
}

.title {
  font-size: 18px;

  margin-bottom: 20px;
}

.comment {
  padding: 18px 0;

  border-bottom: 1px solid #e5e7eb;
}

.profile {
  display: flex;

  gap: 10px;

  align-items: center;

  margin-bottom: 12px;
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

.author {
  font-size: 14px;

  font-weight: 600;
}

.date {
  font-size: 12px;

  color: #8b95a1;
}

.content {
  font-size: 15px;

  line-height: 1.5;
}
</style>
