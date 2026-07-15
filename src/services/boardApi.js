import { success, fail } from './response'
import api from './api'

// 현재는 Mock Data
// FastAPI 연결 시 이 파일 내부만 axios 요청으로 변경

// 게시글 목록 조회
// GET /api/posts
export async function getPosts(params = {}) {
  const response = await api.get('/api/posts', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      keyword: params.keyword ?? '',
      tag: params.tag ?? '',
    },
  })

  console.log('게시글 목록:', response.data)

  return response.data
}

// export async function getPosts(params = {}) {
//   const { page = 1, limit = 10, keyword = '', tag = '' } = params

//   let result = [...posts]

//   // 검색어 필터
//   if (keyword) {
//     const search = keyword.toLowerCase()

//     result = result.filter(
//       (post) =>
//         post.title.toLowerCase().includes(search) ||
//         post.content.toLowerCase().includes(search) ||
//         post.tags?.some((tag) => tag.toLowerCase().includes(search)),
//     )
//   }

//   // 태그 필터
//   if (tag && tag !== '전체') {
//     result = result.filter((post) => post.tags?.includes(tag))
//   }

//   // 페이지 처리
//   const start = (page - 1) * limit

//   const end = start + limit

//   result = result.slice(start, end)

//   return success(
//     result,

//     '게시글 목록 조회 성공',
//   )
// }

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
