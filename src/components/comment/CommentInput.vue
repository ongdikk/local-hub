<template>
  <div class="input-area">
    <input v-model="content" placeholder="댓글을 입력하세요" />

    <button @click="submit">작성</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')

const emit = defineEmits(['submit'])

function submit() {
  if (!content.value.trim()) {
    return
  }

  emit('submit', content.value)

  content.value = ''
}
</script>

<style scoped>
.input-area {
  display: flex;

  gap: 10px;

  margin-top: 20px;
}

input {
  flex: 1;

  padding: 12px;

  border: 1px solid #ddd;

  border-radius: 10px;
}

button {
  padding: 12px 20px;

  border: none;

  border-radius: 10px;

  background: #3182f6;

  color: white;
}
</style>
