<template>
  <div class="form">
    <BaseInput v-model="form.title" placeholder="제목을 입력하세요" />

    <div class="tag-section">
      <div class="label">카테고리</div>

      <div class="tag-list">
        <button
          v-for="tag in tagOptions"
          :key="tag"
          type="button"
          class="tag-chip"
          :class="{ active: form.tags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <textarea v-model="form.content" class="content" placeholder="내용을 입력하세요" />

    <BaseInput
      v-if="showPassword"
      v-model="form.password"
      type="password"
      placeholder="수정 비밀번호"
    />

    <!-- 이미지 선택 및 미리보기 -->
    <div class="image-upload-section">
      <div class="label">이미지 첨부</div>
      
      <div class="upload-container">
        <!-- 파일 선택 클릭 영역 -->
        <label class="upload-trigger">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            class="hidden-file-input" 
            @change="onFilesSelected" 
          />
          <div class="trigger-content">
            <span class="upload-icon">📸</span>
            <span class="upload-text">클릭하여 이미지 추가</span>
            <span class="upload-subtext">최대 10MB 이하의 이미지 파일</span>
          </div>
        </label>

        <!-- 미리보기 그리드 -->
        <div class="previews-grid" v-if="previews.length">
          <div v-for="(p, i) in previews" :key="p" class="preview-card">
            <!-- p가 blob URL이면 apiUrl을 붙이지 않고, 기존 이미지 경로이면 apiUrl을 붙입니다. -->
            <img 
              :src="p.startsWith('blob:') ? p : `${apiUrl}${p}`" 
              class="preview-img" 
              alt="미리보기"
            />
            <button 
              type="button" 
              class="delete-btn" 
              @click="removeFile(i)" 
              aria-label="삭제"
            >
              <span class="delete-icon">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <BaseButton @click="submit">
        {{ buttonText }}
      </BaseButton>

      <BaseButton @click="cancel"> 취소 </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'

import BaseInput from '@/components/common/BaseInput.vue'

import BaseButton from '@/components/common/BaseButton.vue'

import { uploadImage } from '@/services/boardApi'

const apiUrl = import.meta.env.VITE_API_URL || '';

const tagOptions = ['맛집', '카페', '관광', '생활', '질문', '축제', '교통', '숙박']

const props = defineProps({
  initialData: {
    type: Object,

    default: null,
  },

  showPassword: {
    type: Boolean,

    default: false,
  },

  buttonText: {
    type: String,

    default: '등록',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',

  tags: [],

  content: '',

  password: '',
})

// 파일 선택 및 미리보기
const selectedFiles = ref([])
const previews = ref([])
// 기존에 서버에 저장된 이미지 URL들 (편집 시 유지용)
const existingImageUrls = ref([])

watch(
  () => props.initialData,

  (value) => {
    if (!value) return

    form.title = value.title ?? ''

    form.tags = [...(value.tags ?? [])]

    form.content = value.content ?? ''

    form.password = value.password ?? ''
    // 초기 데이터에 image_urls가 있으면 previews와 existingImageUrls에 추가
    if (value.image_urls && Array.isArray(value.image_urls)) {
      existingImageUrls.value = [...value.image_urls]
      // add to previews so UI shows them
      previews.value = [...previews.value, ...value.image_urls]
    }
  },

  {
    immediate: true,
  },
)

function submit() {
  ;(async () => {
    let image_urls = []

    if (selectedFiles.value.length > 0) {
      const results = await Promise.all(
        selectedFiles.value.map((f) => uploadImage(f)),
      )
      image_urls = results.filter((r) => r && r.success).map((r) => r.data)
    }

    // include existingImageUrls (from initialData) + newly uploaded image_urls
    const all_image_urls = [...existingImageUrls.value, ...image_urls]

    emit('submit', {
      title: form.title,
      content: form.content,
      password: form.password,
      tags: form.tags,
      image_urls: all_image_urls,
    })
  })()
}

function cancel() {
  emit('cancel')
}

function toggleTag(tag) {
  const index = form.tags.indexOf(tag)

  if (index === -1) {
    form.tags.push(tag)
  } else {
    form.tags.splice(index, 1)
  }
}

function onFilesSelected(e) {
  const files = Array.from(e.target.files || [])
  files.forEach((f) => {
    // optional: size/type checks
    selectedFiles.value.push(f)
    previews.value.push(URL.createObjectURL(f))
  })
  e.target.value = ''
}

function removeFile(index) {
  const url = previews.value[index]
  // if this preview corresponds to an existing remote URL, remove from existingImageUrls
  const existingIdx = existingImageUrls.value.indexOf(url)
  if (existingIdx !== -1) {
    existingImageUrls.value.splice(existingIdx, 1)
    previews.value.splice(index, 1)
    return
  }

  // otherwise it's a local blob URL linked to selectedFiles
  if (url) URL.revokeObjectURL(url)

  // find corresponding selected file by matching objectURL
  // we don't have a direct mapping, so remove by index: assume previews and selectedFiles kept in same order for blobs
  // Count how many previews before index are blob URLs to compute selectedFiles index
  let blobCount = 0
  for (let i = 0; i < index; i++) {
    if (!existingImageUrls.value.includes(previews.value[i])) blobCount++
  }

  // remove the selected file at blobCount
  if (selectedFiles.value[blobCount]) selectedFiles.value.splice(blobCount, 1)
  previews.value.splice(index, 1)
}
</script>

<style scoped>
.form {
  display: flex;

  flex-direction: column;

  gap: 20px;
}

.tag-section {
  margin: 16px 0;
}

.label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-chip {
  border: 1px solid #d9e2ec;
  background: white;
  color: #555;

  padding: 8px 14px;

  border-radius: 999px;

  cursor: pointer;

  transition: 0.2s;
}

.tag-chip:hover {
  border-color: #3182f6;
}

.tag-chip.active {
  background: #3182f6;
  color: white;
  border-color: #3182f6;
}

.content {
  min-height: 220px;

  padding: 15px;

  border-radius: 12px;

  border: 1px solid #ddd;

  resize: none;
}

.buttons {
  display: flex;

  gap: 10px;
}

@media (max-width: 768px) {
  .tag-chip {
    padding: 6px 10px;
    font-size: 13px;
  }

  .content {
    min-height: 180px;
    padding: 12px;
  }

  .buttons {
    flex-direction: column;
  }

  .buttons .button,
  .buttons basebutton {
    width: 100%;
  }
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

/* 실제 input은 숨김 */
.hidden-file-input {
  display: none;
}

/* 파일 업로드 점선 영역 */
.upload-trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #cbd5e1;
  background: white;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-trigger:hover {
  border-color: #3182f6;
  background: #f0f7ff;
}

.trigger-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.upload-subtext {
  font-size: 12px;
  color: #94a3b8;
}

/* 미리보기 이미지 Grid */
.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.preview-card {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 이미지 카드 호버 시 삭제 버튼 스타일 */
.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.6);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.9); /* 호버 시 빨간색 피드백 */
}

.delete-icon {
  font-size: 11px;
  font-weight: bold;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .previews-grid {
    grid-template-columns: repeat(4, 1fr); /* 모바일에서는 가로로 균등하게 배치 */
    gap: 8px;
  }
  
  .upload-trigger {
    padding: 16px;
  }
  
  .upload-text {
    font-size: 13px;
  }
}
</style>
