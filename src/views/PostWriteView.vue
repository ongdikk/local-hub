<template>

  <Header />

  <div class="container">

    <h2>게시글 작성</h2>

    <BaseInput
      v-model="form.title"
      placeholder="제목"
    />

    <textarea
      v-model="form.content"
      class="content"
      placeholder="내용을 입력하세요."
    />

    <BaseInput
      v-model="form.password"
      type="password"
      placeholder="수정 비밀번호"
    />

    <BaseButton 
        :disabled="!form.title || !form.content || !form.password"    
        @click="submitPost"
    >

      등록하기

    </BaseButton>

  </div>

</template>

<script setup>

import { reactive } from "vue"
import { useRouter } from "vue-router"

import Header from "@/components/common/Header.vue"
import BaseInput from "@/components/common/BaseInput.vue"
import BaseButton from "@/components/common/BaseButton.vue"

import { useBoardStore } from "@/stores/board"

const router = useRouter()

const boardStore = useBoardStore()

const form = reactive({

    title: "",

    content: "",

    password: ""

})

function submitPost(){

    boardStore.addPost({

        title: form.title,

        content: form.content,

        password: form.password

    })

    router.push("/board")

}

</script>

<style scoped>

.container{

    width:900px;

    margin:50px auto;

    display:flex;

    flex-direction:column;

    gap:20px;

}

.content{

    min-height:220px;

    resize:none;

    padding:15px;

}

</style>