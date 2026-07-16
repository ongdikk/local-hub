<template>
  <div v-if="weather" class="weather-wrapper">
    <div class="weather" :style="weatherStyle">
      <!-- 도시 선택 드롭다운 -->
      <select 
        v-model="selectedRegion" 
        @change="handleRegionChange" 
        class="region-select"
        :style="{ color: weatherStyle.color }"
      >
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>

      <span class="icon">{{ weatherTheme.emoji }}</span>
      <span class="temp">{{ weather.temperature }}°C</span>
      <span class="divider" :style="{ color: weatherStyle.dividerColor }">|</span>
      <!-- 한글 날씨 텍스트 출력 -->
      <span>{{ weatherText }}</span>
    </div>

    <!-- tooltip -->
    <div class="tooltip">
      {{ weather.status_message }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { storeToRefs } from 'pinia'

const weatherStore = useWeatherStore()
const { weather, selectedRegion } = storeToRefs(weatherStore)

// 드롭다운 도시 목록
const cities = ['구미', '대구', '칠곡군', '성주군', '고령군', '경주', '안동', '포항', '울릉도']

// 지역 변경 시 날씨 정보 재요청
const handleRegionChange = (event) => {
  weatherStore.loadWeather(event.target.value)
}

/**
 * 낮/밤 여부를 판별하는 헬퍼 함수
 */
const isDaytime = () => {
  // 1. API 응답에 icon 데이터가 포함되어 있다면 마지막 문자(d/n)로 판단 (OpenWeather 표준 방식)
  if (weather.value?.icon) {
    return weather.value.icon.endsWith('d')
  }
  
  // 2. 백엔드에서 icon을 별도로 제공하지 않을 경우, 현재 기기 시간 기준 (06:00 ~ 18:00 낮)
  const currentHour = new Date().getHours()
  return currentHour >= 6 && currentHour < 18
}

/**
 * OpenWeather API 기반 날씨 테마 및 한글 텍스트 매핑
 */
const weatherTheme = computed(() => {
  if (!weather.value) return {}

  const desc = weather.value.weather_description || ''

  // 1. 맑음 (Clear)
  if (desc.includes('맑음')) {
    const isDay = isDaytime()
    
    if (isDay) {
      // 낮의 맑음
      return {
        emoji: '☀️',
        text: '맑음',
        bg: '#fff7e6',
        border: '#ffe3a3',
        color: '#5f4500',
        divider: '#c9a85a'
      }
    } else {
      // 밤의 맑음
      return {
        emoji: '🌙',
        text: '맑음',
        bg: '#141432',
        border: '#2a2a5a',
        color: '#f1f1ff',
        divider: '#434388'
      }
    }
  } 
  
  // 2. 흐림 / 구름 (Clouds)
  if (desc.includes('구름') || desc.includes('흐림') || desc.includes('흐려짐')) {
    return {
      emoji: '☁️',
      text: '흐림',
      bg: '#f5f5f5',
      border: '#d9d9d9',
      color: '#595959',
      divider: '#bfbfbf'
    }
  }

  // 3. 비 / 이슬비 / 소나기 (Rain, Drizzle)
  if (desc.includes('비') || desc.includes('소나기')) {
    return {
      emoji: '🌧️',
      text: '비',
      bg: '#e6f4ff',
      border: '#bae0ff',
      color: '#003a8c',
      divider: '#91caee'
    }
  } 

  // 4. 눈 (Snow)
  if (desc.includes('눈')) {
    return {
      emoji: '❄️',
      text: '눈',
      bg: '#f0f5ff',
      border: '#adc6ff',
      color: '#1d39c4',
      divider: '#adc6ff'
    }
  } 

  // 5. 번개 / 뇌우 (Thunderstorm)
  if (desc.includes('번개') || desc.includes('뇌우') || desc.includes('태풍')) {
    return {
      emoji: '⚡',
      text: '뇌우',
      bg: '#feffe6',
      border: '#fffb8f',
      color: '#614700',
      divider: '#d4b106'
    }
  }

  // 6. 안개 / 황사 / 미세먼지 등 기타 (Mist, Fog, Dust)
  if (desc.includes('안개') || desc.includes('먼지') || desc.includes('황사') || desc.includes('연기')) {
    return {
      emoji: '🌫️',
      text: desc, // '안개', '박무' 등 API 가 제공한 상세 명칭 그대로 표시
      bg: '#fafafa',
      border: '#f0f0f0',
      color: '#262626',
      divider: '#d9d9d9'
    }
  }

  // 기본값
  return {
    emoji: '✨',
    text: desc || '정보 없음',
    bg: '#fafafa',
    border: '#f0f0f0',
    color: '#262626',
    divider: '#d9d9d9'
  }
})

// 화면에 노출할 매핑 텍스트
const weatherText = computed(() => weatherTheme.value.text || '')

// 동적 인라인 스타일 매핑
const weatherStyle = computed(() => {
  return {
    background: weatherTheme.value.bg,
    borderColor: weatherTheme.value.border,
    color: weatherTheme.value.color,
    dividerColor: weatherTheme.value.divider
  }
})

onMounted(() => {
  weatherStore.loadWeather()
})
</script>

<style scoped>
.weather-wrapper {
  position: relative;
}

.weather {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.region-select {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  padding-right: 4px;
}

.region-select option {
  background: #ffffff;
  color: #333333;
}

.icon {
  font-size: 16px;
}

.temp {
  font-weight: 700;
}

.divider {
  transition: color 0.3s;
}

.tooltip {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: max-content;
  max-width: 250px;
  padding: 10px 14px;
  background: white;
  color: #333;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: 0.2s;
  z-index: 100;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  border-left: 1px solid #e5e7eb;
  border-top: 1px solid #e5e7eb;
  transform: rotate(45deg);
}

.weather-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .weather {
    padding: 4px 10px 4px 6px;
    font-size: 13px;
  }
  
  .region-select {
    font-size: 13px;
  }

  .tooltip {
    display: none;
  }
}
</style>
