const comments = [
  {
    id: 1,

    postId: 1,

    author: '익명',

    content: '좋은 정보 감사합니다.',

    createdAt: '2026-07-14T10:30:00',
  },

  {
    id: 2,

    postId: 1,

    author: '익명',

    content: '저도 가봐야겠네요.',

    createdAt: '2026-07-14T11:20:00',
  },
]

// axios.get("/posts/{id}/comments")
export async function getComments(postId) {
  return comments.filter((comment) => comment.postId === Number(postId))
}

// axios.post("/posts/{id}/comments")
export async function createComment(data) {
  const newComment = {
    id: Date.now(),

    author: '익명',

    createdAt: new Date().toISOString(),

    ...data,
  }

  comments.push(newComment)

  return newComment
}
