<template>
  <header class="header">
    <div class="inner">
      <div class="brand">
        <h1>LocalHub</h1>

        <p>구미·경북 지역 커뮤니티</p>
      </div>

      <WeatherBadge />
    </div>

  </header>
</template>

<script setup>
import WeatherBadge from '@/components/common/WeatherBadge.vue'
</script>

<style scoped>
.header {
  width: 100%;

  background: white;

  border-bottom: 1px solid #f1f3f5;

  position: sticky;

  top: 0;

  z-index: 10;
}

.inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 18px 20px;
  
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.brand h1 {
  font-size: 22px;

  font-weight: 800;

  margin: 0;

  color: #191f28;
}

.brand p {
  margin-top: 4px;

  font-size: 13px;

  color: #8b95a1;
}

@media (max-width: 768px) {
  .inner {
    padding: 16px;
  }

  .brand h1 {
    font-size: 20px;
  }

  .brand p {
    display: none;
  }
}
</style>
