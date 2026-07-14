<template>

<input
    class="input"
    :type="type"
    :placeholder="placeholder"
/>

</template>

<script setup>

defineProps({

    type:{

        type:String,

        default:"text"

    },

    placeholder:{

        type:String,

        default:""

    }

})

</script>

<style scoped>

.input{

    width:100%;

    padding:14px;

    border-radius:10px;

    border:1px solid #ddd;

    outline:none;

    font-size:15px;

}

.input:focus{

    border-color:#3182f6;

}

</style>