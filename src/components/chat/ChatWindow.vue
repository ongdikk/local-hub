<template>
  <div class="chat-window">
    <div class="header">
      <span> ✨ LocalHub AI </span>

      <button class="close" @click="$emit('close')">✕</button>
    </div>

    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="message.role">
        {{ message.content }}
      </div>
    </div>

    <div class="input-area">
      <input v-model="input" @keyup.enter="send" placeholder="구미 날씨 알려줘" />

      <button @click="send">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { sendChat } from '@/services/chatApi'

defineEmits(['close'])

const input = ref('')

const messages = ref([
  {
    role: 'bot',
    content: '안녕하세요! 구미 지역 정보를 알려드릴게요.',
  },
])

async function send() {
  if (!input.value.trim()) return

  const userMessage = input.value

  messages.value.push({
    role: 'user',
    content: userMessage,
  })

  input.value = ''

  const history = messages.value.map((message) => ({
    role: message.role,
    content: message.content,
  }))

  const response = await sendChat(userMessage, history)

  messages.value.push({
    role: 'bot',
    content: response.reply,
  })
}
</script>

<style scoped>
.chat-window {
  position: fixed;
  right: 30px;
  bottom: 100px;
  width: 340px;
  height: 450px;

  background: white;
  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  overflow: hidden;

  display: flex;

  flex-direction: column;

  z-index: 999;
}

/* 상단 */

.header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 16px 18px;

  background: #3182f6;

  color: white;

  font-weight: 700;
}

.close {
  background: none;

  border: none;

  color: white;

  font-size: 18px;

  cursor: pointer;
}

/* 메시지 영역 */

.messages {
  flex: 1;

  padding: 16px;

  overflow-y: auto;

  background: #fafafa;
}

.user {
  margin-left: auto;

  background: #3182f6;

  color: white;

  padding: 10px 14px;

  border-radius: 14px;

  width: fit-content;

  max-width: 80%;

  margin-bottom: 10px;
}

.bot {
  background: #f2f4f6;

  padding: 10px 14px;

  border-radius: 14px;

  width: fit-content;

  max-width: 80%;

  margin-bottom: 10px;
}

/* 입력 */

.input-area {
  display: flex;

  gap: 8px;

  padding: 12px;

  border-top: 1px solid #eee;

  background: white;
}

.input-area input {
  flex: 1;

  border: 1px solid #ddd;

  border-radius: 10px;

  padding: 10px;

  outline: none;
}

.input-area button {
  border: none;

  background: #3182f6;

  color: white;

  padding: 0 16px;

  border-radius: 10px;

  cursor: pointer;
}

@media (max-width: 768px) {
  .chat-window {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    bottom: 20px;
    width: calc(100% - 32px);
    height: 320px;
    border-radius: 12px;
  }

  .header {
    padding: 12px;
  }

  .messages {
    padding: 12px;
  }

  .input-area {
    padding: 10px;
  }

  .input-area button {
    padding: 0 12px;
  }
}
</style>
