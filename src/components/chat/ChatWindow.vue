<template>
  <div class="chat-window">
    <!-- 1. 헤더 영역 -->
    <div class="header">
      <span class="header-title"> ✨ LocalHub AI 🗺️ </span>
      <button class="close" @click="$emit('close')">✕</button>
    </div>

    <!-- 2. 메시지 및 카드 렌더링 영역 -->
    <div class="messages" ref="messageBox">
      <div v-for="(message, index) in messages" :key="index" class="message-block">
        
        <!-- 기본 텍스트 말풍선 -->
        <div v-if="message.display" :class="message.role" class="bubble">
          {{ message.content }}
        </div>

        <!-- 💡 맛집/관광지 정보 카드 캐러셀 (창이 커진 만큼 시원시원하게 배치됨) -->
        <div v-if="message.stores && message.stores.length > 0" class="cards-carousel">
          <div v-for="(store, sIdx) in message.stores" :key="sIdx" class="store-item-card">
            
            <!-- 이미지 (없으면 No Image 텍스트 대체) -->
            <div 
              class="card-img" 
              :style="{ backgroundImage: store.first_image ? `url(${store.first_image})` : 'none' }"
              :class="{ 'no-img': !store.first_image }"
            >
              <span v-if="!store.first_image" class="no-img-text">No Image</span>
            </div>
            
            <!-- 카드 상세 텍스트 -->
            <div class="card-body">
              <span class="card-badge">{{ store.category || '음식점' }}</span>
              <h4 class="card-name" :title="store.title">{{ store.title }}</h4>
              <p class="card-address" :title="store.addr1">{{ store.addr1 }}</p>
            </div>

          </div>
        </div>

      </div>

      <!-- API 응답 대기 중 로딩 말풍선 (...) -->
      <div v-if="isPending" class="assistant loading-bubble">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <!-- 3. 입력 영역 -->
    <div class="input-area">
      <input 
        v-model="input" 
        @keyup.enter="send" 
        :disabled="isPending"
        placeholder="구미 인동 맛집 알려줘" 
      />
      <button @click="send" :disabled="isPending">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { sendChat } from '@/services/chatApi'

defineEmits(['close'])

const input = ref('')
const messages = ref([])
const messageBox = ref(null)
const isPending = ref(false)

// 스크롤을 맨 아래로 내려주는 헬퍼 함수
const scrollToBottom = async () => {
  await nextTick()
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight
  }
}

// 새로고침 시 로컬스토리지에서 텍스트와 카드 리스트(stores)까지 통째로 복원
onMounted(() => {
  const savedMessages = localStorage.getItem('localhub_chat_history')
  if (savedMessages) {
    const parsed = JSON.parse(savedMessages)
    
    // 데이터 복원 시 stores 배열 유실 방어
    messages.value = parsed.map(msg => ({
      ...msg,
      stores: msg.stores || [] 
    }))
  } else {
    // 최초 방문 시 출력할 웰컴 메시지
    messages.value = [
      {
        role: 'assistant',
        content: '안녕하세요! 구미/경북 지역 정보를 알려드릴게요.',
        display: true,
        stores: []
      }
    ]
    saveToStorage()
  }
  scrollToBottom()
})

// 로컬스토리지 저장 함수
function saveToStorage() {
  localStorage.setItem('localhub_chat_history', JSON.stringify(messages.value))
}

// 메시지 전송 및 API 호출 함수
async function send() {
  if (!input.value.trim() || isPending.value) return

  const userMessage = input.value

  // 사용자가 보낸 대화 내역에 적재
  messages.value.push({
    role: 'user',
    content: userMessage,
    display: true,
    stores: []
  })

  input.value = ''
  isPending.value = true
  saveToStorage()
  scrollToBottom()

  // 백엔드로 전송할 순수 문맥 데이터 조립 (최초 웰컴 메시지는 생략)
  const historyForBackend = messages.value
    .slice(1)
    .map((msg) => ({
      role: msg.role,
      content: msg.history_content || msg.content
    }))

  try {
    const response = await sendChat(userMessage, historyForBackend)

    // 백엔드 응답에서 맛집 카드 데이터(tool_response) 검증 및 추출
    const fetchedStores = response.tool_response && response.tool_response.length > 0 
      ? response.tool_response 
      : []

    // 봇의 응답 구조에 텍스트 답변과 원본 카드 데이터를 한꺼번에 묶어서 저장합니다.
    messages.value.push({
      role: 'assistant',
      content: response.reply,             
      history_content: response.history_reply, 
      display: true,
      stores: fetchedStores 
    })

  } catch (error) {
    console.error('챗봇 통신 에러:', error)
    messages.value.push({
      role: 'assistant',
      content: '서버와 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.',
      display: true,
      stores: []
    })
  } finally {
    isPending.value = false
    saveToStorage() // 카드가 합쳐진 최종 상태를 완벽하게 영구 저장합니다.
    scrollToBottom()
  }
}
</script>

<style scoped>
/* 💡 [대폭 확장] 데스크톱용 크기 전면 개편 (가로 520px / 세로 680px) */
.chat-window {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 520px; 
  height: 680px; 
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: all 0.3s ease;
}

/* 상단 헤더 균형 조절 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #3182f6;
  color: white;
}
.header-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
}
.close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.close:hover {
  opacity: 1;
}

/* 메시지창 스크롤 컨테이너 */
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 메시지 1블록 래퍼 */
.message-block {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 💡 말풍선 크기 및 가독성 업그레이드 */
.bubble {
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  max-width: 85%;
  margin-bottom: 8px;
  word-break: break-all;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.user { 
  margin-left: auto; 
  background: #3182f6; 
  color: white; 
  border-bottom-right-radius: 4px;
}
.assistant { 
  background: #f2f4f6; 
  color: #191f28; 
  margin-right: auto; 
  border-top-left-radius: 4px;
}

/* 💡 가로형 카드 캐러셀 컨테이너 (여유로운 너비로 한눈에 더 많이 보임) */
.cards-carousel {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 6px 4px 14px 4px;
  width: 100%;
  box-sizing: border-box;
  scrollbar-width: thin;
}
.cards-carousel::-webkit-scrollbar {
  height: 5px;
}
.cards-carousel::-webkit-scrollbar-thumb {
  background: #e5e8eb;
  border-radius: 4px;
}

/* 💡 개별 상점 카드 컴팩트 비율 최적화 (200px 확장) */
.store-item-card {
  flex: 0 0 200px; 
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e8eb;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.store-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-img {
  height: 115px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.no-img {
  background-color: #f2f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-img-text {
  font-size: 12px;
  color: #8b95a1;
}

.card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-badge {
  font-size: 11px;
  color: #3182f6;
  background: #e8f3ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
}
.card-name {
  font-size: 15px;
  font-weight: 700;
  color: #191f28;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-address {
  font-size: 12px;
  color: #6b7684;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 34px;
}

/* 하단 텍스트 입력창 고도화 */
.input-area {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e5e8eb;
  background: white;
}
.input-area input {
  flex: 1;
  border: 1px solid #d1d6db;
  border-radius: 12px;
  padding: 12px 16px;
  outline: none;
  font-size: 15px;
  color: #191f28;
  transition: border-color 0.2s;
}
.input-area input:focus {
  border-color: #3182f6;
}
.input-area input:disabled {
  background: #f9fafb;
  color: #b0b8c1;
}
.input-area button {
  border: none;
  background: #3182f6;
  color: white;
  padding: 0 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.2s;
}
.input-area button:hover:not(:disabled) {
  background: #1b64da;
}
.input-area button:disabled {
  background: #e5e8eb;
  color: #b0b8c1;
  cursor: not-allowed;
}

/* 점 3개 로딩 바운스 애니메이션 */
.loading-bubble { display: flex; align-items: center; gap: 4px; padding: 14px 20px; margin-right: auto; }
.dot { width: 6px; height: 6px; background-color: #8b95a1; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; }
.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

/* 💡 모바일 환경에서는 꽉 차는 모달 형태로 부드럽게 스위칭 */
@media (max-width: 768px) {
  .chat-window {
    left: 16px;
    right: 16px;
    bottom: 16px;
    width: calc(100% - 32px);
    height: 80vh; /* 모바일 기기 화면 높이의 80% 차지 */
    border-radius: 20px;
  }
}
</style>