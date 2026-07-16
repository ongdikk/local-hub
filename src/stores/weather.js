import { defineStore } from 'pinia'
import { getWeather } from '@/services/weatherApi'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: null,
    selectedRegion: '구미'
  }),

  actions: {
    async loadWeather(region = this.selectedRegion) {
      try {
        const response = await getWeather(region)
        this.weather = response
        this.selectedRegion = region
      } catch (error) {
        console.error('날씨 정보를 불러오는 데 실패했습니다.', error)
      }
    },
  },
})
