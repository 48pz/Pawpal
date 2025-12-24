import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Footer from "../components/layout/Footer";
import { useForm } from "react-hook-form";
import api from "../lib/api";
import toast from "react-hot-toast";

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
      <div>
        <Link
          to={"/"}
          className="text-7xl  text-white"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          PawPal
        </Link>
      </div>
      <button
        className="
        text-white 
        flex 
        items-center
        gap-2 
        justify-center
        bg-blue-700 
        px-4 
        py-1
        rounded
        font-semibold 
        hover:bg-[#365899] 
        cursor-pointer 
        w-100
        h-12
        transition"
      >
        <FcGoogle size={20} />
        <span>Log in with Facebook</span>
      </button>
      <div className="flex items-center w-100">
        <div className="h-px flex-1 bg-[#555555]" />
        <span className="text-[#555555] px-4 font-bold">OR</span>
        <div className="h-px flex-1 bg-[#555555]" />
      </div>

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
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}

        <span className="text-white mt-5">
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

        <button
          className="
        text-slate-300
        flex 
        items-center
        gap-2 
        justify-center
        bg-blue-700 
        px-4 
        py-1
        rounded
        font-bold 
        hover:bg-[#365899] 
        cursor-pointer 
        w-100
        h-12
        transition
        disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default RegisterPage;
