<template>

<Header />


<div class="container">


<h2>
게시글 수정
</h2>



<BaseInput

v-model="form.title"

placeholder="제목"

 />



<textarea

v-model="form.content"

class="content"

></textarea>



<div class="buttons">


<BaseButton

@click="submit"

>

수정하기

</BaseButton>



<BaseButton

@click="cancel"

>

취소

</BaseButton>



</div>



</div>

</template>



<script setup>

import {
    reactive,
    onMounted
}
from "vue"



import {
    useRouter,
    useRoute
}
from "vue-router"



import Header from "@/components/common/Header.vue"

import BaseInput from "@/components/common/BaseInput.vue"

import BaseButton from "@/components/common/BaseButton.vue"



import { useBoardStore } from "@/stores/board"



const router = useRouter()

const route = useRoute()


const boardStore =
    useBoardStore()



const form = reactive({

    title:"",

    content:""

})




onMounted(async()=>{


    const post =
        await boardStore.findPost(
            route.params.id
        )



    if(!post){

        router.push("/board")

        return

    }



    form.title =
        post.title


    form.content =
        post.content



})




async function submit(){


    await boardStore.updatePost(

        Number(route.params.id),

        form

    )



    router.push(
        `/post/${route.params.id}`
    )


}



function cancel(){

    router.back()

}


</script>



<style scoped>

.container{

width:900px;

margin:50px auto;

display:flex;

flex-direction:column;

gap:20px;

}



.content{

min-height:220px;

padding:15px;

resize:none;

border:1px solid #ddd;

border-radius:10px;

}



.buttons{

display:flex;

gap:10px;

}



</style>