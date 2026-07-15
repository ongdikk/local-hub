import api from '@/services/api'

// POST /api/chat
// 지역 정보 질의응답
export async function sendChat(message, history = []) {
  const response = await api.post('/api/chat', {
    message,

    history,
  })

  return response.data
}
