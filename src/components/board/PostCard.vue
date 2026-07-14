<template>
  <article class="card" @click="goDetail">
    <h3 class="title">
      {{ post.title }}
    </h3>

    <p class="content">
      {{ post.content }}
    </p>

    <div class="info">
      <span> 👤 익명 </span>

      <span> 조회 {{ post.views }} </span>

      <span> ❤️ {{ post.likes }} </span>
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
</script>

<style scoped>
.card {
  background: white;

  border-radius: 16px;

  padding: 24px;

  margin-bottom: 14px;

  cursor: pointer;

  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 18px;

  font-weight: 700;

  margin-bottom: 10px;
}

.content {
  color: #555;

  line-height: 1.5;

  margin-bottom: 20px;

  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;
}

.info {
  display: flex;

  gap: 14px;

  color: #8b95a1;

  font-size: 14px;
}
</style>
