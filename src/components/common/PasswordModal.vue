<template>
  <div v-if="visible" class="overlay">
    <div class="modal">
      <h3>
        {{ title }}
      </h3>

      <input v-model="password" type="password" placeholder="비밀번호 입력" />

      <div class="buttons">
        <button @click="confirm">확인</button>

        <button @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: '비밀번호 확인',
  },
})

const emit = defineEmits(['confirm', 'close'])

const password = ref('')

function confirm() {
  emit(
    'confirm',

    password.value,
  )

  password.value = ''
}

function close() {
  password.value = ''

  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.4);

  display: flex;

  align-items: center;

  justify-content: center;
}

.modal {
  background: white;

  padding: 30px;

  border-radius: 16px;

  width: 320px;
}

input {
  width: 100%;

  padding: 12px;

  margin: 20px 0;

  border: 1px solid #ddd;

  border-radius: 8px;
}

.buttons {
  display: flex;

  gap: 10px;
}

button {
  flex: 1;

  padding: 10px;

  border: none;

  border-radius: 8px;

  cursor: pointer;
}
</style>
