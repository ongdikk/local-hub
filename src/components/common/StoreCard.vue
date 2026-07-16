<template>
  <div class="store-card">
    <div class="image-wrap" v-if="store.first_image || store.first_image2">
      <a
        v-if="store.mapx != null && store.mapy != null"
        :href="mapHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img class="main-image" :src="store.first_image || store.first_image2" alt="store image" />
      </a>

      <img
        v-else
        class="main-image"
        :src="store.first_image || store.first_image2"
        alt="store image"
      />

      <!-- second image handled as a separate card by parent view -->
    </div>

    <div class="store-body">
      <div v-if="!hideTitle">
        <div class="store-title">{{ store.title }}</div>
        <div class="store-category">{{ store.category }}</div>

        <div class="store-addr">{{ store.addr1 }}{{ store.addr2 ? ' ' + store.addr2 : '' }}</div>

        <div class="store-tel" v-if="store.tel">☎ {{ store.tel }}</div>

        <a
          class="store-map"
          v-if="store.mapx != null && store.mapy != null"
          :href="mapHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          지도보기
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
})

// Kakao map link format: /link/map/{name},{lat},{lng} where lat = mapy, lng = mapx
const mapHref = computed(() => {
  const s = props.store || {}

  if (s.mapx == null || s.mapy == null) return '#'

  const name = encodeURIComponent(s.title || '')

  return `https://map.kakao.com/link/map/${name},${s.mapy},${s.mapx}`
})
</script>

<style scoped>
.store-card {
  display: flex;
  gap: 14px;
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(99, 102, 241, 0.08);
  align-items: flex-start;
  transition:
    transform 0.14s cubic-bezier(0.2, 0.9, 0.35, 1),
    box-shadow 0.14s ease;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  box-shadow: 0 8px 20px rgba(10, 25, 47, 0.05);
}

/* fixed desktop card width */
.store-card {
  /* width: 340px; */
  width: 100%;
}

.image-wrap {
  width: 140px;
  height: 96px;
  flex: 0 0 140px;
  overflow: hidden;
  border-radius: 10px;
  background: #f6f9fb;
  border: 1px solid rgba(14, 165, 233, 0.06);
}

.image-wrap .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-wrap {
  position: relative;
}

.store-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
}

.store-title {
  font-weight: 700;
  font-size: 20px;
  color: #041024;
}

.store-category {
  font-size: 13px;
  color: #6b7280;
}

.store-addr {
  font-size: 13px;
  color: #374151;
}

.store-tel {
  font-size: 13px;
  color: #374151;
}

.store-map {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  text-decoration: none;
  border: none;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.12);
}

.store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 40px rgba(10, 25, 47, 0.12);
}

@media (max-width: 600px) {
  .store-card {
    flex-direction: column;
    align-items: stretch;
  }

  .image-wrap {
    width: 100%;
    height: 180px;
    flex: none;
    border-radius: 12px;
  }

  .image-wrap .main-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .store-body {
    padding-top: 10px;
  }
}
</style>
