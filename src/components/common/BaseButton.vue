<template>
  <button class="button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.button {
  width: 100%;
  padding: 14px;

  border: none;
  border-radius: 10px;

  background: #3182f6;
  color: white;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.button:hover {
  background: #2563eb;
}

.button:disabled {
  background: #bfc8d6;

  cursor: not-allowed;
}
</style>
