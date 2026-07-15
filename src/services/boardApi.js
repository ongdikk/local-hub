import { success, fail } from './response'
import api from './api'

// 현재는 Mock Data
// FastAPI 연결 시 이 파일 내부만 axios 요청으로 변경

const posts = [
  {
    id: 1,
    title: '구미역 근처 맛집 추천',
    content: '혼밥 가능한 곳 추천 부탁드립니다.',

    views: 35,
    likes: 12,
    bookmarks: 0,

    tags: ['맛집', '구미'],

    image_urls: [],

    created_at: '2026-07-14T12:30:00',

    password: '1111',
  },

  {
    id: 2,
    title: '금오산 야경 좋네요',
    content: '오늘 날씨가 좋아서 산책하기 좋습니다.',

    views: 17,
    likes: 4,
    bookmarks: 1,

    tags: ['관광', '금오산'],

    image_urls: [],

    created_at: '2026-07-13T20:10:00',

    password: '1111',
  },

  {
    id: 3,
    title: '중앙시장 주차 질문',
    content: '주말에도 자리 있나요?',

    views: 41,
    likes: 8,
    bookmarks: 6,

    tags: ['생활', '주차'],

    image_urls: [],

    created_at: '2026-07-12T09:20:00',

    password: '1111',
  },
]

// 게시글 전체 조회
// GET /api/posts
// export async function getPosts() {
//   return success(
//     [...posts],

//     '게시글 목록 조회 성공',
//   )
// }
export async function getPosts(params = {}) {
  const { page = 1, limit = 10, keyword = '', tag = '' } = params

  let result = [...posts]

  // 검색어 필터
  if (keyword) {
    const search = keyword.toLowerCase()

    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(search)),
    )
  }

  // 태그 필터
  if (tag && tag !== '전체') {
    result = result.filter((post) => post.tags?.includes(tag))
  }

  // 페이지 처리
  const start = (page - 1) * limit

  const end = start + limit

  result = result.slice(start, end)

  return success(
    result,

    '게시글 목록 조회 성공',
  )
}

// 게시글 작성
// POST /api/posts
// export async function createPost(data) {
//   const newPost = {
//     id: Date.now(),
//     views: 0,
//     likes: 0,
//     bookmarks: 0,
//     tags: [],
//     image_urls: [],
//     created_at: new Date().toISOString(),

//     ...data,
//   }

//   // API 연결 시에는 삭제
//   posts.unshift(newPost)

//   return success(newPost, '게시글 작성 성공')
// }
export async function createPost(data) {
  console.log('createPost 호출됨', data)

  try {
    const response = await api.post('/api/posts', data)

    console.log('API 응답', response)

    console.log('현재 posts:', posts)

    return success(response.data, '게시글 작성 성공')
  } catch (error) {
    console.log('API 오류', error)

    return fail(error.response?.data?.message ?? '게시글 작성 실패')
  }
}

// 게시글 상세 조회
// GET /api/posts/{id}
// export async function getPostById(id) {
//   const post = posts.find((post) => post.id === Number(id))

//   if (!post) {
//     return fail('게시글을 찾을 수 없습니다.')
//   }

//   return success(
//     post,

//     '게시글 조회 성공',
//   )
// }
export async function getPostById(id) {
  const post = posts.find((post) => post.id === Number(id))

  if (!post) {
    return fail('게시글을 찾을 수 없습니다.')
  }

  return success(
    {
      ...post,
    },
    '게시글 조회 성공',
  )
}

// 게시글 수정
// PUT /api/posts/{id}
export async function updatePost(id, data) {
  const index = posts.findIndex((post) => post.id === Number(id))

  if (index === -1) {
    return fail('수정할 게시글이 없습니다.')
  }

  posts[index] = {
    ...posts[index],

    title: data.title,

    content: data.content,
  }

  return success(
    posts[index],

    '게시글 수정 성공',
  )
}

// 게시글 삭제
// DELETE /api/posts/{id}
export async function deletePost(id) {
  const index = posts.findIndex((post) => post.id === Number(id))

  if (index === -1) {
    return fail('삭제할 게시글이 없습니다.')
  }

  posts.splice(
    index,

    1,
  )

  return success(
    true,

    '게시글 삭제 성공',
  )
}

// 비밀번호 확인
// POST /api/posts/{id}/verify
export async function checkPassword(id, password) {
  const post = posts.find((post) => post.id === Number(id))

  if (!post) {
    return fail('게시글이 없습니다.')
  }

  const result = post.password === password

  return success(
    result,

    '비밀번호 확인 완료',
  )
}

export async function toggleLike(id, liked) {
  const post = posts.find((post) => post.id === Number(id))

  if (!post) {
    return false
  }

  if (liked) {
    post.likes += 1
  } else {
    post.likes -= 1
  }

  return success(post, '좋아요 변경 성공')
}

export async function toggleBookmark(id, bookmarked) {
  const post = posts.find((post) => post.id === Number(id))

  if (!post) {
    return false
  }

  if (bookmarked) {
    post.bookmarks += 1
  } else {
    post.bookmarks -= 1
  }

  return success(post, '북마크 변경 성공')
}

export async function increaseView(id) {
  const post = posts.find((post) => post.id === Number(id))

  if (!post) {
    return false
  }

  post.views += 1

  return success(post, '조회수 증가 성공')
}
