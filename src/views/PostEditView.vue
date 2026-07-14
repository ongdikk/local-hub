<template>
  <Header />

  <div class="container">
    <div class="card">
      <h2>게시글 수정</h2>

      <BaseInput
        v-model="form.title"
        placeholder="제목을 입력하세요."
      />

      <textarea
        v-model="form.content"
        class="content"
        placeholder="내용을 입력하세요."
      ></textarea>

      <div class="button-group">
        <BaseButton
          @click="submit"
          :disabled="!isValid"
        >
          수정하기
        </BaseButton>

        <BaseButton
          @click="cancel"
        >
          취소
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

import Header from "@/components/common/Header.vue"
import BaseInput from "@/components/common/BaseInput.vue"
import BaseButton from "@/components/common/BaseButton.vue"

import { useBoardStore } from "@/stores/board"

const router = useRouter()
const route = useRoute()

const boardStore = useBoardStore()

const form = reactive({
  title: "",
  content: ""
})

const isValid = computed(() => {
  return form.title.trim() && form.content.trim()
})

onMounted(async () => {

  const post = await boardStore.findPost(route.params.id)

  if (!post) {
    router.push("/board")
    return
  }

  form.title = post.title
  form.content = post.content
})

async function submit() {

  await boardStore.updatePost(route.params.id, form)

  router.push(`/post/${route.params.id}`)
}

function cancel() {

  router.back()

}
</script>

<style scoped>

.container{

    max-width:900px;

    margin:40px auto;

}

.card{

    background:white;

    border-radius:16px;

    padding:32px;

    box-shadow:0 4px 20px rgba(0,0,0,.06);

}

h2{

    margin-bottom:24px;

}

.content{

    width:100%;

    min-height:250px;

    resize:none;

    padding:14px;

    margin-top:16px;

    border:1px solid #ddd;

    border-radius:10px;

    outline:none;

    font-size:15px;

    box-sizing:border-box;

}

.content:focus{

    border-color:#3182f6;

}

.button-group{

    display:flex;

    gap:12px;

    margin-top:24px;

}

</style>