<template>
  <div class="form">
    <BaseInput v-model="form.title" placeholder="제목을 입력하세요" />

    <div class="tag-section">
      <div class="label">
        카테고리
      </div>

      <div class="tag-list">
        <button v-for="tag in tagOptions" :key="tag" type="button"
          class="tag-chip" :class="{ active: form.tags.includes(tag) }"
          @click="toggleTag(tag)">
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

    <div class="buttons">
      <BaseButton @click="submit">
        {{ buttonText }}
      </BaseButton>

      <BaseButton @click="cancel"> 취소 </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

import BaseInput from '@/components/common/BaseInput.vue'

import BaseButton from '@/components/common/BaseButton.vue'

const tagOptions = [
  '맛집',
  '카페',
  '관광',
  '생활',
  '질문',
  '축제',
  '교통',
  '숙박',
]

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

watch(
  () => props.initialData,

  (value) => {
    if (!value) return

    form.title = value.title ?? ''

    form.tags = [...(value.tags ?? [])]

    form.content = value.content ?? ''

    form.password = value.password ?? ''
  },

  {
    immediate: true,
  },
)

function submit() {
  emit(
    'submit',

    {
      title: form.title,

      content: form.content,

      password: form.password,

      tags: form.tags,
    },
  )
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

  transition: .2s;
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
</style>
