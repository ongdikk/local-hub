<template>
  <div class="list">
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
</style>
