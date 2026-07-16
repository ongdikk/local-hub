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
    <div class="image-upload">
      <label class="label">이미지 첨부</label>
      <input type="file" accept="image/*" multiple @change="onFilesSelected" />

      <div class="previews" v-if="previews.length">
        <div v-for="(p, i) in previews" :key="p" class="preview-item">
          <img :src="p" class="preview-img" />
          <button type="button" @click="removeFile(i)">삭제</button>
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
</style>
