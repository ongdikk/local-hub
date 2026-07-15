import { defineStore } from 'pinia'

import { getWeather } from '@/services/weatherApi'

export const useWeatherStore = defineStore(
  'weather',

  {
    state: () => ({
      weather: null,
    }),

    actions: {
      async loadWeather(region = '구미') {
        const response = await getWeather(region)

        this.weather = response
      },
    },
  },
)
