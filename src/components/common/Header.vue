<template>
  <header class="header">

    <div class="logo">
      LocalHub
    </div>

    <nav>

      <RouterLink to="/board">
        게시판
      </RouterLink>

      <RouterLink to="/login">
        로그인
      </RouterLink>

    </nav>

  </header>
</template>

<script setup>
</script>

<style scoped>

.header{

    height:70px;

    background:white;

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:0 40px;

    box-shadow:0 2px 10px rgba(0,0,0,.05);

}

.logo{

    font-size:24px;

    font-weight:bold;

    color:#3182f6;

}

nav{

    display:flex;

    gap:30px;

}

a{

    text-decoration:none;

    color:#444;

    font-weight:600;

}

.router-link-active{

    color:#3182f6;

}

</style>