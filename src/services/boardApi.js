import { success, fail } from './response'
import api from './api'

// 현재는 Mock Data
// FastAPI 연결 시 이 파일 내부만 axios 요청으로 변경

// 게시글 목록 조회
export async function getPosts(params = {}) {
  const { page = 1, limit = 10, keyword = '', tag = '' } = params

  try {
    const response = await api.get('/api/posts', {
      params: {
        page,
        limit,
        keyword,
        tag,
      },
    })

    return success(response.data, '게시글 목록 조회 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '게시글 조회 실패')
  }
}

// 게시글 작성
// POST /api/posts
export async function createPost(data) {
  try {
    const response = await api.post('/api/posts', data)

    // 서버에서 생성된 post id만 반환하는 구조를 기대함

    return success(response.data, '게시글 작성 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '게시글 작성 실패')
  }
}

// 게시글 상세 조회
// GET /api/posts/{id}
export async function getPostById(id) {
  try {
    const response = await api.get(`/api/posts/${id}`)

    return success(response.data, '게시글 조회 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '게시글 조회 실패')
  }
}

// 게시글 수정
// PUT /api/posts/{id}
export async function updatePost(id, data) {
  try {
    const response = await api.put(`/api/posts/${id}`, data)

    return success(response.data, '게시글 수정 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '게시글 수정 실패')
  }
}

// 게시글 삭제
// DELETE /api/posts/{id}
export async function deletePost(id, password) {
  try {
    // axios delete with body: pass { data: ... }
    const response = await api.delete(`/api/posts/${id}`, { data: { password } })

    return success(response.data ?? true, '게시글 삭제 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '게시글 삭제 실패')
  }
}

// 비밀번호 확인
// POST /api/posts/{id}/verify
export async function checkPassword(id, password) {
  try {
    const response = await api.post(`/api/posts/${id}/verify`, { password })

    // 서버가 { verified: boolean } 또는 boolean 을 반환한다고 가정
    const data = response.data

    console.log('checkPassword API response:', data)

    // 다양한 형태 대응: boolean, { verified }, { valid }, { success }, { result }, 숫자(1/0)
    let verified = false

    if (typeof data === 'boolean') {
      verified = data
    } else if (typeof data === 'number') {
      verified = data === 1
    } else if (data && typeof data === 'object') {
      verified = !!(data.verified ?? data.valid ?? data.success ?? data.result ?? data)
    } else {
      verified = Boolean(data)
    }
    return success(verified, '비밀번호 확인 완료')
  } catch (error) {
    return fail(error.response?.data?.message ?? '비밀번호 확인 실패')
  }
}

// 좋아요 토글
// POST /api/posts/{post_id}/like
export async function toggleLike(id, liked) {
  try {
    const response = await api.post(`/api/posts/${id}/like`, liked ? 'like' : 'unlike')

    return success(response.data, '좋아요 변경 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '좋아요 변경 실패')
  }
}

// 북마크 토글
// POST /api/posts/{post_id}/bookmark
export async function toggleBookmark(id) {
  try {
    const response = await api.post(`/api/posts/${id}/bookmark`, 'string')

    return success(response.data, '북마크 변경 성공')
  } catch (error) {
    return fail(error.response?.data?.message ?? '북마크 변경 실패')
  }
}

// export async function increaseView(id) {
//   try {
//     const response = await api.post(`/api/posts/${id}/view`)

//     return success(response.data, '조회수 증가 성공')
//   } catch (error) {
//     return fail(error.response?.data?.message ?? '조회수 증가 실패')
//   }
// }
