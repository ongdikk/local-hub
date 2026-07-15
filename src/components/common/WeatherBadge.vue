<template>
  <div
    v-if="weather"
    class="weather-wrapper"
  >

    <div class="weather">

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


    <!-- tooltip -->
    <div class="tooltip">
      {{ weather.travel_suitability }}
    </div>


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

.weather-wrapper {

  position: relative;

}


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


  cursor:pointer;

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



/* tooltip */

.tooltip {

  position:absolute;

  top: calc(100% + 10px);

  right:0;


  width:max-content;

  max-width:250px;


  padding:10px 14px;


  background:white;

  color:#333;


  border:1px solid #e5e7eb;

  box-shadow:0 8px 20px rgba(0,0,0,0.08);


  border-radius:12px;


  font-size:13px;

  line-height:1.4;


  opacity:0;

  visibility:hidden;


  transform:translateY(-5px);


  transition:.2s;


  z-index:100;

}



.tooltip::before {

  content:"";


  position:absolute;


  top:-6px;

  right:20px;


  width:12px;

  height:12px;


  background:white;


  border-left:1px solid #e5e7eb;

  border-top:1px solid #e5e7eb;


  transform:rotate(45deg);

}


/* hover */

.weather-wrapper:hover .tooltip {

  opacity:1;

  visibility:visible;


  transform:translateY(0);

}


</style>