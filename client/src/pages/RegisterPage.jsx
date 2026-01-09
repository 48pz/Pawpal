import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Footer from "../components/layout/Footer";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import toast from "react-hot-toast";
import Button from "../components/Button";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/api/v1/auth/register", data);
      toast.success("Account created successfully.");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-black w-full flex flex-col justify-center items-center min-h-screen gap-5">
      {/* Logo */}
      <div>
        <Link
          to={"/"}
          className="text-7xl text-white"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          PawPal
        </Link>
      </div>

      {/* OAuth button */}
      <Button
        variant="secondary"
        size="lg"
        className="w-100 flex items-center justify-center gap-2"
        onClick={() => {
          window.location.href =
            import.meta.env.VITE_API_BASE_URL + "/api/v1/auth/google";
        }}
      >
        <FcGoogle size={20} />
        <span>Log in with Google</span>
      </Button>

      {/* OR divider */}
      <div className="flex items-center w-100">
        <div className="h-px flex-1 bg-[#555555]" />
        <span className="text-[#555555] px-4 font-bold">OR</span>
        <div className="h-px flex-1 bg-[#555555]" />
      </div>

      {/* Register form */}
      <form
        className="flex flex-col justify-center items-center w-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400 text-left w-full">
            {errors.email.message}
          </p>
        )}

        <Input
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400 text-left w-full">
            {errors.password.message}
          </p>
        )}

        <Input
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-400 text-left w-full">
            {errors.username.message}
          </p>
        )}

        {/* Terms */}
        <span className="text-white mt-5 text-sm text-center">
          By signing up, you agree to our
          <Link className="text-blue-500 hover:text-blue-400"> Terms</Link>,
          <Link className="text-blue-500 hover:text-blue-400">
            {" "}
            Privacy Policy
          </Link>{" "}
          and
          <Link className="text-blue-500 hover:text-blue-400">
            {" "}
            Cookies Policy
          </Link>
          .
        </span>

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-100 mt-5"
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <Footer />
    </div>
  );
};

export default RegisterPage;
