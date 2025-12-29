import { useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Button from "../Button";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      await api.post("/api/v1/posts", {
        contentText: content,
      });
      toast.success("Post created");
      setContent("");
      onPostCreated?.();
    } catch (err) {
      console.error("Failed to create post", err);
      toast.error("Create post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded mb-6">
      <textarea
        className="resize-none w-full bg-black text-white border border-gray-700 rounded p-3"
        rows={3}
        placeholder="What’s your dog up to today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end mt-3">
        {/* <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-2xl font-semibold text-sm disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button> */}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          size="lg"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
