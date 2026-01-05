import { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Button from "../Button";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    const fetchDogs = async () => {
      const res = await api.get("/api/v1/dog");
      setDogs(res.data.dogs || []);
    };
    fetchDogs();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("contentText", content);
      formData.append("dogs", JSON.stringify(selectedDogs));

      images.forEach((img) => formData.append("media", img));
      if (video) formData.append("media", video);

      await api.post("/api/v1/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created");
      onPostCreated();
      setContent("");
      setSelectedDogs([]);
      setImages([]);
      setVideo(null);
      setVideoPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Create post failed");
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
      {dogs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {dogs.map((dog) => {
            const active = selectedDogs.includes(dog._id);

            return (
              <button
                key={dog._id}
                type="button"
                onClick={() =>
                  setSelectedDogs((prev) =>
                    prev.includes(dog._id)
                      ? prev.filter((id) => id !== dog._id)
                      : [...prev, dog._id]
                  )
                }
                className={`
            px-3 py-1 rounded-full text-xs transition
            ${
              active
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }
          `}
              >
                #{dog.name}
              </button>
            );
          })}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(img)}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {video && (
        <div className="mt-3 relative">
          <video
            src={videoPreview}
            controls
            className="w-full rounded-xl max-h-80"
          />
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(videoPreview);
              setVideo(null);
              setVideoPreview(null);
            }}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      )}

      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = ""; // 允许重复选择同一文件

          if (video) return toast.error("Remove video before adding images");
          if (images.length + files.length > 6)
            return toast.error("You can upload up to 6 images");

          setImages((prev) => [...prev, ...files]);
        }}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;

          if (images.length > 0)
            return toast.error("Remove images before adding a video");

          const url = URL.createObjectURL(file);
          setVideo(file);
          setVideoPreview(url);
        }}
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => imgInputRef.current?.click()}
            disabled={!!video}
          >
            Add Photos
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={images.length > 0}
          >
            Add Video
          </Button>
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
