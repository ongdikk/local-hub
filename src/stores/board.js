import { defineStore } from "pinia"


import {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    checkPassword

} from "@/services/boardApi"



export const useBoardStore = defineStore("board", {


    state:()=>({

        posts:[]

    }),



    actions:{


        // 게시글 전체 조회

        async loadPosts(){


            const data = await getPosts()


            this.posts = data


        },



        // 게시글 작성

        async addPost(post){


            const newPost =
                await createPost(post)



            this.posts.unshift(newPost)


        },



        // 게시글 상세 조회

        async findPost(id){


            return await getPostById(id)


        },



        // 게시글 수정

        async updatePost(id,form){


            const updatedPost =
                await updatePost(
                    id,
                    form
                )



            if(!updatedPost){

                return false

            }



            const index =
                this.posts.findIndex(
                    post =>
                    post.id === Number(id)
                )



            if(index !== -1){

                this.posts[index] =
                    updatedPost

            }



            return true


        },



        // 게시글 삭제

        async removePost(id){


            const success =
                await deletePost(id)



            if(!success){

                return false

            }



            this.posts =
                this.posts.filter(

                    post =>
                    post.id !== Number(id)

                )



            return true


        },



        // 비밀번호 확인

        async checkPostPassword(id,password){


            return await checkPassword(

                id,

                password

            )


        }


    }


})