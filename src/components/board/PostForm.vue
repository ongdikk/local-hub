<template>
  <div class="form">
    <BaseInput v-model="form.title" placeholder="제목을 입력하세요" />

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

  content: '',

  password: '',
})

watch(
  () => props.initialData,

  (value) => {
    if (!value) return

    form.title = value.title ?? ''

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
    },
  )
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.form {
  display: flex;

  flex-direction: column;

  gap: 20px;
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
