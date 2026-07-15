import api from './api'

// GET /api/weather
// 지역 날씨 조회
export async function getWeather(region = '구미') {
  const response = await api.get('/api/weather', {
    params: {
      region,
    },
  })

  console.log(response.data)

  return response.data
}
