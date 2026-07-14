<template>
  <article class="card" @click="goDetail">
    <div class="header">
      <div class="profile">
        <div class="avatar">👤</div>

        <div>
          <div class="writer">
            {{ post.author }}
          </div>

          <div class="time">
            {{ formatDate(post.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="category">
      {{ post.category }}
    </div> -->

    <h3 class="title">
      {{ post.title }}
    </h3>

    <p class="content">
      {{ post.content }}
    </p>

    <div class="footer">
      <span> 👁 {{ post.views }} </span>

      <span> ❤️ {{ post.likes }} </span>

      <span> 💬 {{ post.commentCount }} </span>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

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
  const now = new Date()

  const created = new Date(date)

  const diff = Math.floor((now - created) / (1000 * 60))

  if (diff < 60) {
    return `${diff}분 전`
  }

  if (diff < 1440) {
    return `${Math.floor(diff / 60)}시간 전`
  }

  return created.toLocaleDateString()
}
</script>

<style scoped>
.card {
  background: white;

  border-radius: 18px;

  padding: 24px;

  margin-bottom: 14px;

  cursor: pointer;

  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.header {
  margin-bottom: 18px;
}

.profile {
  display: flex;

  align-items: center;

  gap: 10px;
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
  font-size: 14px;

  font-weight: 600;
}

.time {
  font-size: 12px;

  color: #8b95a1;
}

.title {
  font-size: 19px;

  font-weight: 700;

  margin-bottom: 12px;
}

.content {
  color: #4b5563;

  line-height: 1.6;

  margin-bottom: 20px;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;
}

.footer {
  border-top: 1px solid #f0f1f3;

  padding-top: 14px;

  display: flex;

  gap: 18px;

  color: #8b95a1;

  font-size: 14px;
}

@media (max-width: 768px) {
  .card {
    padding: 20px;
  }

  .title {
    font-size: 17px;
  }
}

/* .category {
  display: inline-block;

  background: #eef4ff;

  color: #3182f6;

  padding: 5px 10px;

  border-radius: 12px;

  font-size: 12px;

  margin-bottom: 10px;

  font-weight: 600;
} */
</style>
