<template>
  <div class="card" @click="goDetail">

    <h3>{{ post.title }}</h3>

    <div class="info">

      <span>익명</span>

      <span>조회 {{ post.views }}</span>

    </div>

    <p class="content">

      {{ post.content }}

    </p>

    <div class="bottom">

      ❤️ {{ post.likes }}

    </div>

  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({

    post:Object

})

function goDetail(){

    router.push(`/post/${props.post.id}`)

}

</script>