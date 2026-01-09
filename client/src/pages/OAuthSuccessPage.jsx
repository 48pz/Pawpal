import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/useUser";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      login({ token });
      navigate("/post");
    }
  }, []);

  return <div className="p-10 text-center">Logging in with Google…</div>;
};

export default OAuthSuccess;
