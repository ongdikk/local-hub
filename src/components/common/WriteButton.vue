<template>
  <button class="write-button" @click="goWrite">
    <span class="icon"> ✎ </span>

    <span> 글쓰기 </span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goWrite() {
  router.push('/write')
}
</script>

<style scoped>
.write-button {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  height: 52px;
  padding: 0 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border: none;

  border-radius: 28px;

  background: #3182f6;

  color: white;

  font-size: 15px;

  font-weight: 600;

  box-shadow: 0 8px 20px rgba(49, 130, 246, 0.25);

  cursor: pointer;

  transition: 0.2s;
}

.write-button:hover {
  transform: translateX(-50%) translateY(-3px);
}

.icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .write-button {
    bottom: 20px;
    height: 48px;
    padding: 0 22px;
    font-size: 14px;
    height: 48px;
    padding: 0 22px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .write-button {
    left: auto;
    right: 16px;
    transform: none;
    bottom: 20px;
  }
}
</style>
