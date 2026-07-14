const posts = [

    {
        id:1,

        title:"구미역 근처 맛집 추천",

        content:"혼밥 가능한 곳 추천 부탁드립니다.",

        views:35,

        likes:12,

        password:"1111"

    },


    {
        id:2,

        title:"금오산 야경 좋네요",

        content:"오늘 날씨가 좋아서 산책하기 좋습니다.",

        views:17,

        likes:4,

        password:"1111"

    },


    {
        id:3,

        title:"중앙시장 주차 질문",

        content:"주말에도 자리 있나요?",

        views:41,

        likes:8,

        password:"1111"

    }

]



// 게시글 전체 조회

export async function getPosts(){

    return [...posts]

}



// 게시글 작성

export async function createPost(post){


    const newPost = {

        id:Date.now(),

        views:0,

        likes:0,

        ...post

    }


    posts.unshift(newPost)


    return newPost

}



// 게시글 상세 조회

export async function getPostById(id){


    return posts.find(
        post => post.id === Number(id)
    )

}



// 게시글 수정

export async function updatePost(id,data){


    const index = posts.findIndex(
        post => post.id === Number(id)
    )


    if(index === -1){

        return false

    }



    posts[index] = {

        ...posts[index],

        title:data.title,

        content:data.content

    }



    return posts[index]

}



// 게시글 삭제

export async function deletePost(id){


    const index = posts.findIndex(
        post => post.id === Number(id)
    )


    if(index === -1){

        return false

    }



    posts.splice(index,1)


    return true

}



// 비밀번호 확인

export async function checkPassword(id,password){


    const post = posts.find(

        post => post.id === Number(id)

    )


    if(!post){

        return false

    }



    return post.password === password

}