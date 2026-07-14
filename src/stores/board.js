import { defineStore } from "pinia"

import { getPosts, createPost, getPostById, updatePost } from "@/servives/boardApi"

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
        },

        async updatePost(id, form) {

            const index = this.posts.findIndex(
                post => post.id === Number(id)
            )

            if(index === -1) return false

            this.posts[index] = {
                ...this.posts[index],
                title: form.title,
                content: form.content
            }

            return true
        }

    }

})