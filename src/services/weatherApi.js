import api from './api'

// GET /api/weather
// 지역 날씨 조회
export async function getWeather(region = '구미') {
  return {
    temp: 24.5,
    condition: '맑음',
    travel_suitability: '여행하기 좋은 날씨입니다.',
  }
}

// export async function getWeather(region = '구미') {
//   const response = await api.get('/api/weather', {
//     params: {
//       region,
//     },
//   })

//   return response.data
// }
