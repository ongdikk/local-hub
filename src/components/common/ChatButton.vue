<template>
  <button class="chat-button" @click="openChat">
    <span> ✨ </span>
  </button>
</template>

<script setup>
function openChat() {
  alert('AI 챗봇 준비중입니다.')
}
</script>

<style scoped>
.chat-button {
  position: fixed;

  right: 30px;

  bottom: 30px;

  width: 56px;

  height: 56px;

  border: none;

  border-radius: 50%;

  background: white;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  font-size: 24px;

  cursor: pointer;

  transition: 0.2s;
}

.chat-button:hover {
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .chat-button {
    right: 20px;

    bottom: 20px;

    width: 52px;

    height: 52px;

    font-size: 22px;
  }
}
</style>
