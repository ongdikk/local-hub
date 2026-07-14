<template>

<div class="signup-card">

    <h1>회원가입</h1>

    <BaseInput
        placeholder="아이디"
    />

    <BaseInput
        placeholder="닉네임"
    />

    <BaseInput
        type="password"
        placeholder="비밀번호"
    />

    <BaseInput
        type="password"
        placeholder="비밀번호 확인"
    />

    <BaseButton>

        회원가입

    </BaseButton>

    <RouterLink
        to="/login"
        class="login"
    >

        로그인으로 돌아가기

    </RouterLink>

</div>

</template>

<script setup>

import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'

</script>

<style scoped>

.signup-card{

    width:420px;

    background:white;

    padding:40px;

    border-radius:20px;

    box-shadow:0 5px 20px rgba(0,0,0,.08);

    display:flex;

    flex-direction:column;

    gap:18px;

}

.login{

    text-align:center;

    text-decoration:none;

    color:#3182f6;

}

</style>