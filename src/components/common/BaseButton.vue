<template>

<button class="btn">

    <slot />

</button>

</template>

<script setup>
</script>

<style scoped>

.btn{

    padding:12px 22px;

    border:none;

    border-radius:10px;

    background:#3182f6;

    color:white;

    cursor:pointer;

    font-size:15px;

    font-weight:bold;

    transition:.2s;

}

.btn:hover{

    background:#1b64d8;

}

</style>