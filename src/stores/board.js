import { defineStore } from "pinia"

import { getPosts, createPost, getPostById } from "@/servives/boardApi"

export const useBoardStore = defineStore("board", {

    state:()=>({

        posts:[]

    }),

    actions:{

        async loadPosts(){

            this.posts = await getPosts()

        },

        async addPost(post) {
            
            const newPost = await createPost(post)
            this.posts.unshift(newPost)
        },

        async findPost(id){

            return await getPostById(id)
        }

    }

})