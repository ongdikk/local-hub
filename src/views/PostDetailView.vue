<template>

<Header />

<div class="container" v-if="post">

    <div class="card">

        <h1>

            {{ post.title }}

        </h1>

        <div class="meta">

            <span>익명</span>

            <span>조회 {{ post.views }}</span>

            <span>❤️ {{ post.likes }}</span>

        </div>

        <hr>

        <p class="content">

            {{ post.content }}

        </p>

        <div class="buttons">

            <BaseButton @click="goBoard">

                목록으로

            </BaseButton>

            <BaseButton @click="editPost">

                수정

            </BaseButton>

            <BaseButton @click="deletePost">

                삭제

            </BaseButton>

        </div>

    </div>

</div>

</template>

<script setup>

import { ref,onMounted } from "vue"

import { useRouter,useRoute } from "vue-router"

import Header from "@/components/common/Header.vue"

import BaseButton from "@/components/common/BaseButton.vue"

import { useBoardStore } from "@/stores/board"

const router = useRouter()

const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

onMounted(async()=>{

    post.value = await boardStore.findPost(route.params.id)

})

function goBoard(){

    router.push("/board")

}

function editPost(){

    router.push(`/edit/${route.params.id}`)

}

function deletePost(){

    alert("STEP 9에서 구현합니다.")

}

</script>

<style scoped>

.container{

    width:900px;

    margin:40px auto;

}

.card{

    background:white;

    border-radius:20px;

    padding:35px;

    box-shadow:0 3px 12px rgba(0,0,0,.05);

}

.meta{

    display:flex;

    gap:20px;

    color:#777;

    margin:15px 0;

}

.content{

    margin:30px 0;

    line-height:1.8;

}

.buttons{

    display:flex;

    gap:15px;

}

</style>