<template>

<header class="header">

  <div 
    class="logo"
    @click="goHome"
  >

    LocalHub

  </div>


  <nav>

    <button>
      로그인
    </button>

  </nav>


</header>

</template>


<script setup>

import { useRouter } from "vue-router"


const router = useRouter()



function goHome(){

  router.push("/board")

}

</script>


<style scoped>


.header{

  height:64px;

  background:white;

  border-bottom:1px solid #eee;

  display:flex;

  align-items:center;

  justify-content:space-between;

  padding:0 32px;

  position:sticky;

  top:0;

  z-index:10;

}



.logo{

  font-size:22px;

  font-weight:700;

  cursor:pointer;

}



button{

  border:none;

  background:none;

  color:#3182f6;

  cursor:pointer;

}



</style>