import { defineStore } from "pinia"

import { getPosts } from "@/servives/boardApi"

export const useBoardStore = defineStore("board", {

    state:()=>({

        posts:[]

    }),

    actions:{

        async loadPosts(){

            this.posts = await getPosts()

        }

    }

})