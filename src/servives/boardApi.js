const posts = [

    {

        id:1,

        title:"구미역 근처 맛집 추천",

        content:"혼밥 가능한 곳 추천 부탁드립니다.",

        views:35,

        likes:12

    },

    {

        id:2,

        title:"금오산 야경 좋네요",

        content:"오늘 날씨가 좋아서 산책하기 좋습니다.",

        views:17,

        likes:4

    },

    {

        id:3,

        title:"중앙시장 주차 질문",

        content:"주말에도 자리 있나요?",

        views:41,

        likes:8

    }

]

export async function getPosts(){

    return posts

}

export async function createPost(post) {
  return {
    id: Date.now(),
    views: 0,
    likes: 0,
    ...post,
  }
}