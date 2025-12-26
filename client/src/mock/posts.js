export const mockPosts = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  content: `This is post number ${i + 1}`,
}));