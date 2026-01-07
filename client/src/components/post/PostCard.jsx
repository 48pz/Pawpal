import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import api from "../../lib/api";
import CommentSection from "./CommentSection";
import { useUser } from "../../context/useUser";
import UserHoverPopover from "../user/UserHoverPopover";

const PostCard = ({ post, onDeleted }) => {
  const { user } = useUser();

  const media = post.media || [];
  const hasVideo = media.some((m) => m.type === "video");
  const images = media.filter((m) => m.type === "image");

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(!!post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // popover state
  const [popover, setPopover] = useState({
    open: false,
    x: 0,
    y: 0,
    userId: null,
  });

  const isOwner = post.author?._id === user?._id;

  const slides = useMemo(
    () =>
      media.map((m) =>
        m.type === "image"
          ? { src: m.url }
          : {
              type: "video",
              sources: [{ src: m.url, type: "video/mp4" }],
            }
      ),
    [media]
  );

  const handleLike = async () => {
    if (liking) return;

    try {
      setLiking(true);
      if (!liked) {
        const res = await api.post(`/api/v1/posts/${post._id}/like`);
        setLikes(res.data.likesCount);
        setLiked(true);
      } else {
        const res = await api.delete(`/api/v1/posts/${post._id}/like`);
        setLikes(res.data.likesCount);
        setLiked(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeleting(true);
      await api.delete(`/api/v1/posts/${post._id}`);
      toast.success("Post deleted successfully");
      onDeleted?.(post._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#0b1220] rounded-2xl border border-white/5 p-5">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* avatar (click to open popover) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              const authorId =
                typeof post.author === "string"
                  ? post.author
                  : post.author?._id;

              if (!authorId) return;

              setPopover({
                open: true,
                x: e.clientX,
                y: e.clientY,
                userId: authorId,
              });
            }}
          >
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
          </button>

          {/* username + time */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {post.author?.username}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* delete button */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>

      {/* content */}
      <div className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap mb-4">
        {post.contentText}
      </div>

      {/* dog tags */}
      {post.dogs?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.dogs.map((dog) => (
            <span
              key={dog._id}
              className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full"
            >
              #{dog.name}
            </span>
          ))}
        </div>
      )}

      {/* video */}
      {hasVideo && (
        <div
          className="mb-4 rounded-xl overflow-hidden bg-black h-60 flex items-center justify-center cursor-pointer"
          onClick={() => {
            setIndex(media.findIndex((m) => m.type === "video"));
            setOpen(true);
          }}
        >
          <video
            src={media.find((m) => m.type === "video").url}
            muted
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* images */}
      {!hasVideo && images.length > 0 && (
        <div
          className={`mb-4 grid gap-2 ${
            images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {images.map((img, idx) => {
            const globalIndex = media.findIndex((m) => m.url === img.url);

            return (
              <div
                key={idx}
                onClick={() => {
                  setIndex(globalIndex);
                  setOpen(true);
                }}
                className="rounded-xl overflow-hidden bg-[#020617] h-45 flex items-center justify-center cursor-pointer hover:opacity-90 transition"
              >
                <img
                  src={img.url}
                  alt="post media"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center gap-6 pt-3 border-t border-white/5 text-gray-400">
        <button
          onClick={handleLike}
          disabled={liking}
          className="flex items-center gap-1 hover:text-red-400 transition disabled:opacity-50"
        >
          {liked ? (
            <AiFillHeart size={18} className="text-red-500" />
          ) : (
            <AiOutlineHeart size={18} />
          )}
          <span className="text-xs">{likes}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1 hover:text-blue-400 transition"
        >
          <AiOutlineComment size={18} />
          <span className="text-xs">{post.commentsCount || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <CommentSection postId={post._id} />
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Video]}
      />

      {/* hover popover */}
      <UserHoverPopover
        open={popover.open}
        x={popover.x}
        y={popover.y}
        userId={popover.userId}
        onClose={() =>
          setPopover((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
};

export default PostCard;
