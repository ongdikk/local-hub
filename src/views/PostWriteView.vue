<template>

<Header />

<div class="container">

<h2>글쓰기</h2>

<input

v-model="form.title"

placeholder="제목"

/>

<textarea

v-model="form.content"

placeholder="내용"

/>

<input

type="password"

v-model="form.password"

placeholder="수정 비밀번호"

/>

<button>

등록

</button>

</div>

</template>

<script setup>

import { reactive } from "vue"
import { useRouter } from "vue-router"

import Header from "@/components/common/Header.vue"
import { useBoardStore } from "@/stores/board"

const router = useRouter()
const boardStore = useBoardStore()

const form = reactive({

    title: "",

    content: "",

    password: ""

})

</script>

<style scoped>

.container{

width:900px;

margin:50px auto;

}

</style>