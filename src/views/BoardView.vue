<template>

<Header />

<div class="container">

<input

class="search"

v-model="keyword"

placeholder="🔍 지역 정보를 검색해보세요."

>

<PostList

:posts="filteredPosts"

/>

<button

class="write"

@click="goWrite"

>

+

</button>

</div>

</template>

<script setup>

import { ref,onMounted,computed } from "vue"

import { useRouter } from "vue-router"

import Header from "@/components/common/Header.vue"

import PostList from "@/components/board/PostList.vue"

import { useBoardStore } from "@/stores/board"

const router = useRouter()

const boardStore = useBoardStore()

const keyword = ref("")

onMounted(()=>{

    boardStore.loadPosts()

})

const filteredPosts = computed(()=>{

    return boardStore.posts.filter(post=>{

        return post.title.includes(keyword.value)

    })

})

function goWrite(){

    router.push("/write")

}

</script>

<style scoped>

.container{

    max-width:720px;

    margin:40px auto;

}

.search{

    width:100%;

    padding:16px 20px;

    background:white;

    border-radius:14px;

    border:none;

    font-size:15px;

    margin-bottom:20px;

    box-shadow:
        0 2px 8px rgba(0,0,0,.04);

}

.write{

    position:fixed;

    right:40px;

    bottom:40px;

    width:65px;

    height:65px;

    border:none;

    border-radius:50%;

    background:#3182f6;

    color:white;

    font-size:35px;

    cursor:pointer;

}

</style>