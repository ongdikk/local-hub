<template>

<Header />

<div class="container">

<h1>

게시글 상세

</h1>

<p>

여기에 게시글 내용이 표시됩니다.

</p>

<button @click="goBack">

목록으로

</button>

</div>

</template>

<script setup>

import { useRouter,useRoute } from 'vue-router'

import Header from '@/components/common/Header.vue'

const router=useRouter()

const route=useRoute()

console.log(route.params.id)

function goBack(){

    router.push("/board")

}

</script>

<style scoped>

.container{

width:900px;

margin:50px auto;

}

button{

margin-top:30px;

padding:12px 18px;

}

</style>