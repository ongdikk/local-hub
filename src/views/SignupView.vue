<template>

<Header />

<div class="container">

    <SignupForm />

</div>

</template>

<script setup>

import Header from '@/components/common/Header.vue'
import SignupForm from '@/components/auth/SignupForm.vue'

</script>

<style scoped>

.container{

    display:flex;

    justify-content:center;

    margin-top:70px;

}

</style>