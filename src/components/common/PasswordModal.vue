<template>

<div
    v-if="visible"
    class="overlay"
>

    <div class="modal">

        <h3>
            {{ title }}
        </h3>


        <input
            v-model="password"
            type="password"
            placeholder="비밀번호 입력"
        />


        <div class="buttons">

            <BaseButton @click="confirm">
                확인
            </BaseButton>


            <BaseButton @click="close">
                취소
            </BaseButton>

        </div>


    </div>

</div>

</template>


<script setup>

import { ref } from "vue"

import BaseButton from "./BaseButton.vue"


defineProps({

    visible:Boolean,

    title:{
        type:String,
        default:"비밀번호 확인"
    }

})


const emit = defineEmits([

    "confirm",
    "close"

])


const password = ref("")


function confirm(){

    emit(
        "confirm",
        password.value
    )

    password.value=""

}


function close(){

    password.value=""

    emit("close")

}


</script>


<style scoped>

.overlay{

position:fixed;

inset:0;

background:rgba(0,0,0,.4);

display:flex;

justify-content:center;

align-items:center;

}


.modal{

width:360px;

padding:30px;

background:white;

border-radius:18px;

}


input{

width:100%;

padding:12px;

border:1px solid #ddd;

border-radius:10px;

margin:20px 0;

}


.buttons{

display:flex;

gap:10px;

}


</style>