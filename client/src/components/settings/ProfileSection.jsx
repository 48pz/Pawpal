import { useForm } from "react-hook-form";
import Textarea from "../Textarea";
import AvatarCropModal from "../settings/AvatarCropModal";
import { useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useUser } from "../../context/useUser";
import { useEffect } from "react";

const ProfileSection = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      bio: "",
    },
  });
  const { user, setUser } = useUser();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBlob, setAvatarBlob] = useState(null);
  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.bio !== undefined) {
      formData.append("bio", data.bio);
    }
    if (avatarBlob) {
      formData.append("avatar", avatarBlob);
    }
    try {
      const res = await api.put("/api/v1/user/me", formData);
      setUser(res.data.user);

      toast.success("Profile updated successfully");

      setAvatarBlob(null);
    } catch (err) {
      toast.error("Update profile failed");
      console.error("Update profile failed", err);
    }
  };

  const handleAvatarConfirm = ({ preview, blob }) => {
    setAvatarPreview(preview);
    setAvatarBlob(blob);
  };

  useEffect(() => {
    if (user) {
      reset({
        bio: user.bio || "",
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user, reset]);
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
        bg-[#0f172a] 
        rounded-2xl 
        p-6 
        mb-6 
        border border-white/5
      "
      >
        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-xl">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAvatarOpen(true)}
            className="
              px-4 py-2
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-sm font-semibold
              text-white
              transition
            "
          >
            Change avatar
          </button>
        </div>

        <Textarea
          label="Bio"
          rows={3}
          placeholder="Introduce your dog(s)"
          {...register("bio")}
        />

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
            inline-flex items-center justify-center
            px-5 py-2.5
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            text-white
            text-sm font-semibold
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
      <AvatarCropModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onConfirm={handleAvatarConfirm}
      />
    </>
  );
};

export default ProfileSection;
