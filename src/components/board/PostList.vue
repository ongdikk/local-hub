<template>
  <div class="list">
    <div v-if="posts.length === 0" class="empty">검색 결과가 없습니다.</div>

    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup>
import PostCard from './PostCard.vue'

defineProps({
  posts: {
    type: Array,

    default: () => [],
  },
})
</script>

<style scoped>
.list {
  width: 100%;
}

.empty {
  padding: 60px 0;

  text-align: center;

  color: #8b95a1;

  font-size: 15px;
}
</style>
