<template>
  <div class="tabs">
    <button
      v-for="tag in tagOptions"
      :key="tag"
      :class="{ active: selected === tag }"
      @click="select(tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tagOptions = ['전체', '맛집', '카페', '관광', '생활', '질문', '축제', '교통', '숙박']

const selected = ref('전체')

const emit = defineEmits(['change'])

function select(tag) {
  selected.value = tag

  emit('change', tag)
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
}

button {
  border: none;
  background: #f2f4f6;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #e8f1ff;
}

button.active {
  background: #3182f6;
  color: white;
}
</style>
