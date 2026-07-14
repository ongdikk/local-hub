<template>
  <div class="comments">
    <h3>댓글 {{ comments.length }}</h3>

    <div v-for="comment in comments" :key="comment.id" class="comment">
      <div class="author">👤 {{ comment.author }}</div>

      <div class="content">
        {{ comment.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.comment {
  padding: 15px 0;

  border-bottom: 1px solid #eee;
}

.author {
  font-size: 14px;

  font-weight: 600;

  margin-bottom: 6px;
}

.content {
  color: #555;
}
</style>
