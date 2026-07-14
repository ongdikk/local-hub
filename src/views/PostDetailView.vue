<template>

  <Header />

  <div class="container" v-if="post">

    <div class="card">

      <h1 class="title">
        {{ post.title }}
      </h1>


      <div class="meta">

        <span>
          익명
        </span>

        <span>
          조회 {{ post.views }}
        </span>

        <span>
          ❤️ {{ post.likes }}
        </span>

      </div>


      <div class="divider"></div>


      <div class="content">

        {{ post.content }}

      </div>


      <div class="button-group">

        <BaseButton
          @click="goBoard"
        >
          목록
        </BaseButton>


        <BaseButton
          @click="editPost"
        >
          수정
        </BaseButton>


        <BaseButton
          @click="deletePost"
        >
          삭제
        </BaseButton>


      </div>


    </div>


  </div>


  <PasswordModal

    :visible="showPasswordModal"

    :title="
      actionType === 'edit'
      ? '수정 비밀번호 확인'
      : '삭제 비밀번호 확인'
    "

    @confirm="confirmPassword"

    @close="closeModal"

  />

</template>


<script setup>

import { ref, onMounted } from "vue"

import {
  useRouter,
  useRoute
} from "vue-router"


import Header from "@/components/common/Header.vue"

import BaseButton from "@/components/common/BaseButton.vue"

import PasswordModal from "@/components/common/PasswordModal.vue"


import { useBoardStore } from "@/stores/board"



const router = useRouter()

const route = useRoute()


const boardStore = useBoardStore()



const post = ref(null)



// 비밀번호 모달 상태

const showPasswordModal = ref(false)


// 현재 실행할 작업

const actionType = ref("")



onMounted(async()=>{


  post.value =
    await boardStore.findPost(
      route.params.id
    )


  if(!post.value){

    router.push("/board")

  }


})



// 게시판 이동

function goBoard(){

  router.push("/board")

}



// 수정 클릭

function editPost(){

  actionType.value = "edit"

  showPasswordModal.value = true

}



// 삭제 클릭

function deletePost(){

  actionType.value = "delete"

  showPasswordModal.value = true

}



// 비밀번호 확인
async function confirmPassword(password){


    console.log("confirmPassword 실행")

    console.log(
        "actionType:",
        actionType.value
    )


    const result =
        await boardStore.checkPostPassword(

            Number(route.params.id),

            password

        )


    console.log(
        "비밀번호 결과:",
        result
    )



    if(!result){

        alert(
            "비밀번호가 일치하지 않습니다."
        )

        return

    }



    const action =
        actionType.value



    console.log(
        "실행할 action:",
        action
    )



    closeModal()



    if(action === "edit"){


        console.log("수정 이동 실행")


        router.push(
            `/edit/${route.params.id}`
        )

    }



    if(action === "delete"){


        console.log("삭제 실행")


        await boardStore.removePost(

            Number(route.params.id)

        )


        router.push("/board")


    }


}


// 모달 닫기

function closeModal(){

  showPasswordModal.value = false

}


</script>



<style scoped>


.container{

  max-width:900px;

  margin:40px auto;

}



.card{

  background:white;

  border-radius:18px;

  padding:32px;

  box-shadow:
    0 4px 18px rgba(0,0,0,.06);

}



.title{

  font-size:28px;

  font-weight:700;

  margin-bottom:18px;

}



.meta{

  display:flex;

  gap:18px;

  color:#777;

  font-size:14px;

}



.divider{

  height:1px;

  background:#eee;

  margin:24px 0;

}



.content{

  min-height:250px;

  line-height:1.8;

  white-space:pre-wrap;

}



.button-group{

  display:flex;

  gap:12px;

  margin-top:32px;

}



</style>