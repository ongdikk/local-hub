<template>

<Header />

<div class="container">

    <LoginForm />

</div>

</template>

<script setup>

import Header from '@/components/common/Header.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

</script>

<style scoped>

.container{

    display:flex;

    justify-content:center;

    margin-top:70px;

}

</style>