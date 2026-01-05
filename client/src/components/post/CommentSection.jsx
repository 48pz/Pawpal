import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);

  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/comments", {
        params: {
          postId,
          page: pageNum,
          limit: PAGE_SIZE,
        },
      });

      setComments(res.data.comments || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [postId]);


  const submitComment = async () => {
    if (!content.trim()) {
      return toast.error("Comment cannot be empty");
    }

    try {
      await api.post("/api/v1/comments", {
        postId,
        content,
        parentCommentId: replyTarget?.parentCommentId,
        replyToUserId: replyTarget?.replyToUserId,
      });

      setContent("");
      setReplyTarget(null);

    
      fetchComments(1);

      onCommentAdded?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Comment failed");
    }
  };


  return (
    <div className="mt-4 border-t border-white/5 pt-4 text-white">
      {/* comments list */}
      {loading ? (
        <div className="text-sm text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-400">No comments yet</div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="text-sm">
              <div className="leading-relaxed">
                <span className="font-semibold">{c.author.username}</span>
                {c.replyToUser && (
                  <>
                    {" "}
                    <span className="text-gray-400">replied to</span>{" "}
                    <span className="font-semibold">
                      @{c.replyToUser.username}
                    </span>
                  </>
                )}
                ：{c.content}
              </div>

              <button
                onClick={() =>
                  setReplyTarget({
                    parentCommentId: c.parentComment || c._id,
                    replyToUserId: c.author._id,
                    replyToUsername: c.author.username,
                  })
                }
                className="mt-1 text-xs text-blue-400 hover:underline"
              >
                Reply
              </button>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
          <button
            disabled={page <= 1}
            onClick={() => fetchComments(page - 1)}
            className="disabled:opacity-40"
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => fetchComments(page + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* input */}
      <div className="mt-4 flex gap-2">
        {replyTarget && (
          <div className="text-xs text-gray-400 mb-1">
            Replying to @{replyTarget.replyToUsername}
          </div>
        )}

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            replyTarget
              ? `Reply @${replyTarget.replyToUsername}`
              : "Add a comment..."
          }
          className="
            w-full
            bg-[#020617]
            border border-white/10
            rounded-lg
            px-3 py-2
            text-sm
            text-white
            placeholder:text-gray-500
            focus:outline-none
            focus:border-blue-400
          "
        />
        <button
          onClick={submitComment}
          className="text-sm text-blue-400 hover:underline"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
