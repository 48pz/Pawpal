import { useState, useEffect } from "react";
import api from "../lib/api";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/v1/user/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.error("fetchMe error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);
  useEffect(() => {}, [user]);
  const login = async () => {
    setLoading(true);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchMe,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
