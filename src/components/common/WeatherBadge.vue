<template>
  <div v-if="weather" class="weather">

    <span class="icon">
      ☀️
    </span>

    <span class="temp">
      {{ weather.temp }}°C
    </span>

    <span class="divider">
      |
    </span>

    <span>
      {{ weather.condition }}
    </span>

  </div>
</template>


<script setup>

import { onMounted } from 'vue'

import { useWeatherStore } from '@/stores/weather'

import { storeToRefs } from 'pinia'


const weatherStore = useWeatherStore()

const { weather } = storeToRefs(weatherStore)


onMounted(() => {

  weatherStore.loadWeather()

})

</script>


<style scoped>

.weather {

  display:flex;

  align-items:center;

  gap:8px;


  padding:8px 16px;


  border-radius:999px;


  background:#fff7e6;


  border:1px solid #ffe3a3;


  color:#5f4500;


  font-size:14px;

  font-weight:600;


  white-space:nowrap;

}


.icon {

  font-size:16px;

}


.temp {

  font-weight:700;

}


.divider {

  color:#c9a85a;

}


</style>