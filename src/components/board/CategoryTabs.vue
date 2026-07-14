<template>
  <div class="tabs">
    <button
      v-for="category in categories"
      :key="category"
      :class="{ active: selected === category }"
      @click="select(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ['전체', '맛집', '관광', '생활', '질문']

const selected = ref('전체')

const emit = defineEmits(['change'])

function select(category) {
  selected.value = category

  emit('change', category)
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
}

button.active {
  background: #3182f6;

  color: white;
}
</style>
