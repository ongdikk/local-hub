<template>
  <div class="wrapper">
    <textarea
      v-model="content"
      placeholder="댓글을 입력하세요."
      @keydown.enter.exact.prevent="submit"
    ></textarea>

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
.wrapper {
  margin-top: 20px;
}

textarea {
  width: 100%;

  min-height: 30px;

  padding: 14px;

  border: 1px solid #ddd;

  border-radius: 14px;

  resize: none;

  font-size: 15px;

  box-sizing: border-box;
}

textarea:focus {
  outline: none;

  border-color: #3182f6;
}

button {
  margin-top: 10px;

  float: right;

  padding: 10px 22px;

  border: none;

  border-radius: 12px;

  background: #3182f6;

  color: white;

  cursor: pointer;

  font-weight: 600;
}

button:hover {
  background: #2563eb;
}
</style>
