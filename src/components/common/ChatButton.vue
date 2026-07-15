<template>
  <button class="chat-button" @click="$emit('toggle')">
    {{ opened ? '✕' : '✨' }}
  </button>
</template>

<script setup>
defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])
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

@media (max-width: 480px) {
  .chat-button {
    right: 16px;
    bottom: 90px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>
