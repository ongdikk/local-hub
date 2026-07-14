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

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/common/Header.vue'
import PostList from '@/components/board/PostList.vue'

const router = useRouter()

const keyword = ref("")

const posts = [
    {
        id:1,
        title:"구미역 근처 맛집 추천",
        content:"혼밥 가능한 곳 추천 부탁드립니다.",
        views:35,
        likes:12
    },
    {
        id:2,
        title:"금오산 야경 좋네요",
        content:"오늘 날씨가 좋아서 산책하기 딱입니다.",
        views:17,
        likes:4
    },
    {
        id:3,
        title:"구미 중앙시장 주차",
        content:"주말에 주차 자리 괜찮나요?",
        views:41,
        likes:8
    }
]

const filteredPosts = computed(()=>{

    return posts.filter(post=>{

        return post.title.includes(keyword.value)

    })

})

function goWrite(){

    router.push("/write")

}

</script>

<style scoped>

.container{

    width:900px;

    margin:40px auto;

}

.search{

    width:100%;

    padding:16px;

    border:none;

    border-radius:14px;

    margin-bottom:30px;

    font-size:16px;

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