const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow">
      {/* header: author + time */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">
          {post.author?.username}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      {/* content */}
      <div className="text-white mb-4">{post.contentText}</div>
      <div className="flex items-center gap-16 text-gray-400 text-sm">
        <button className="hover:text-red-400 transition">❤️ Like</button>

        <button className="hover:text-blue-400 transition">💬 Comment</button>
      </div>
    </div>
  );
};

export default PostCard;
