import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";

const PostCard = ({ post }) => {
  return (
    <div
      className="
        bg-[#0b1220]
        rounded-2xl
        border border-white/5
        p-5
      "
    >
      {/* header */}
      <div className="flex items-center gap-3 mb-3">
        {/* avatar placeholder */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
          {post.author?.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {post.author?.username?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {post.author?.username}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap mb-4">
        {post.contentText}
      </div>

      {/* footer */}
      <div
        className="
          flex items-center gap-6
          pt-3
          border-t border-white/5
          text-gray-400
        "
      >
        <button className="flex items-center gap-1 hover:text-red-400 transition">
          <AiOutlineHeart size={18} />
          <span className="text-xs">{post.likesCount || 0}</span>
        </button>

        <button className="flex items-center gap-1 hover:text-blue-400 transition">
          <AiOutlineComment size={18} />
          <span className="text-xs">{post.commentsCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
