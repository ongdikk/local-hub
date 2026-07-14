<template>
  <div class="card">

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

// 부모가 post를 넘겨주면 {{ post.title }} 처럼 사용 가능
defineProps({

    post:Object

})

</script>

<style scoped>

.card{

    background:white;

    border-radius:18px;

    padding:24px;

    margin-bottom:18px;

    box-shadow:0 3px 12px rgba(0,0,0,.05);

    cursor:pointer;

    transition:.2s;

}

.card:hover{

    transform:translateY(-3px);

}

h3{

    margin-bottom:10px;

}

.info{

    display:flex;

    gap:18px;

    color:gray;

    font-size:14px;

}

.content{

    margin:18px 0;

    line-height:1.6;

}

.bottom{

    color:#3182f6;

    font-weight:bold;

}

</style>