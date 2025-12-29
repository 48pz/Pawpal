import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../lib/api";

const PasswordSection = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.put("/api/v1/user/change-password", data);
      toast.success("Password updated successfully");
    } catch (err) {
      const message = err.response?.data?.message;
      toast.error(message || "Failed to update password");
    }
  };

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
        <h2 className="text-lg font-semibold text-white mb-4">Password</h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            className="
            w-full
            bg-[#020617]
            border border-white/10
            rounded-xl
            px-4 py-3
            text-sm text-white
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/40
            transition
          "
            {...register("currentPassword", { required: true })}
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-400 mt-1">
              Current password is required
            </p>
          )}

          <input
            type="password"
            placeholder="New password"
            className="
            w-full
            bg-[#020617]
            border border-white/10
            rounded-xl
            px-4 py-3
            text-sm text-white
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/40
            transition
          "
            {...register("newPassword", { required: true, minLength: 6 })}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-400 mt-1">
              New password must be at least 6 characters
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
            inline-flex items-center justify-center
            px-5 py-2.5
            rounded-xl
            text-sm font-semibold
            bg-rose-600
            hover:bg-rose-500
            text-white
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            {isSubmitting ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PasswordSection;
