<template>
  <Header />

  <div class="container" v-if="post">
    <div class="card">
      <h1 class="title">
        {{ post.title }}
      </h1>

      <div class="meta">
        <span>익명</span>
        <span>조회 {{ post.views }}</span>
        <span>❤️ {{ post.likes }}</span>
      </div>

      <div class="divider"></div>

      <div class="content">
        {{ post.content }}
      </div>

      <div class="button-group">
        <BaseButton @click="goBoard">
          목록
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
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

import Header from "@/components/common/Header.vue"
import BaseButton from "@/components/common/BaseButton.vue"

import { useBoardStore } from "@/stores/board"

const router = useRouter()
const route = useRoute()

const boardStore = useBoardStore()

const post = ref(null)

onMounted(async () => {

  post.value = await boardStore.findPost(route.params.id)

  if (!post.value) {
    router.push("/board")
  }

})

function goBoard() {

  router.push("/board")

}

function editPost() {

  router.push(`/edit/${route.params.id}`)

}

async function deletePost() {

  const ok = confirm("게시글을 삭제하시겠습니까?")

  if (!ok) return

  await boardStore.removePost(route.params.id)

  router.push("/board")

}
</script>

<style scoped>

.container{

    max-width:900px;

    margin:40px auto;

}

.card{

    background:white;

    border-radius:18px;

    padding:32px;

    box-shadow:0 4px 18px rgba(0,0,0,.06);

}

.title{

    font-size:28px;

    font-weight:700;

    margin-bottom:18px;

}

.meta{

    display:flex;

    gap:18px;

    color:#777;

    font-size:14px;

}

.divider{

    height:1px;

    background:#eee;

    margin:24px 0;

}

.content{

    min-height:250px;

    line-height:1.8;

    white-space:pre-wrap;

}

.button-group{

    display:flex;

    gap:12px;

    margin-top:32px;

}

</style>