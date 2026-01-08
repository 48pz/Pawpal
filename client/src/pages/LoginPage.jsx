import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import dogImg from "/dog_main.png";
import Footer from "../components/layout/Footer";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../lib/api";
import Button from "../components/Button";
import { useUser } from "../context/useUser";

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "yoyo@gmail.com",
      password: "123456",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/v1/auth/login", data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);

      login({ token, user });
      toast.success("Login successful.");
      navigate("/post");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black grid place-items-center px-6">
      {/* layout */}
      <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-5xl">
        {/* desktop */}
        <div className="hidden lg:flex w-200 h-130 rounded-3xl bg-[#111] shadow-lg">
          <img
            src={dogImg}
            alt="Dog main"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* login form */}
        <div className="w-full max-w-sm flex flex-col items-center text-center text-white">
          <h1
            className="text-7xl mb-6"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            PawPal
          </h1>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full mt-5"
            >
              {" "}
              {isSubmitting ? "Logging..." : "Log in"}
            </Button>
          </form>

          <div className="flex items-center w-full my-6">
            <div className="h-px flex-1 bg-[#555555]" />
            <span className="text-[#555555] px-4">OR</span>
            <div className="h-px flex-1 bg-[#555555]" />
          </div>

          <div className="flex items-center gap-2">
            <FcGoogle size={20} />
            <Link to="/" className="text-blue-500 font-medium">
              Log in with Google
            </Link>
          </div>

          <Link to="/" className="mt-5 text-sm text-gray-300 hover:text-white">
            Forgot password?
          </Link>

          <div className="mt-8 text-sm text-gray-300">
            <span className="mr-2">Don’t have an account?</span>
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
