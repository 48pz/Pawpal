import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { useUser } from "../context/useUser";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { label: "Feed", to: "/post" },
    { label: "Walks", to: "/walks" },
    { label: "Pawpedia", to: "/pawpedia" },
  ];
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    api
      .get("/api/v1/notification/unread-count")
      .then((res) => {
        setUnreadCount(res.data.count);
      })
      .catch((err) => {
        console.error("unread-count failed", err);
      });
  }, []);

  const handleLogout = async () => {
    await api.post("/api/v1/auth/logout");
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {open && (
        <div
          className="
            fixed inset-0
            bg-black/40
            backdrop-blur-[1px]
            z-40
          "
          onClick={() => setOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/5">
        <div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div
            className="text-xl font-bold text-white cursor-pointer"
            style={{ fontFamily: "'Baloo 2', cursive" }}
            onClick={() => navigate("/post")}
          >
            PawPal
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                  relative text-sm font-medium transition
                  ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
                  after:content-['']
                  after:absolute after:left-0 after:-bottom-3
                  after:h-[2px] after:rounded-full
                  after:bg-blue-500 after:transition-all
                  ${
                    isActive
                      ? "after:w-full after:opacity-100"
                      : "after:w-0 after:opacity-0"
                  }
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3" ref={dropdownRef}>
            <button
              className="
                relative p-2 rounded-full
                text-gray-400
                hover:text-white hover:bg-white/5
                transition
              "
              onClick={() => {
                navigate("/notifications");
              }}
            >
              <AiOutlineMail size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="
                w-9 h-9 rounded-full
                bg-linear-to-br from-blue-500 to-cyan-400
                flex items-center justify-center
                text-sm font-bold text-white
                hover:opacity-90 transition
              "
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() || "N"}
                </span>
              )}
            </button>

            {open && (
              <div
                className="
                  absolute top-14 right-6
                  z-50
                  w-44 rounded-xl
                  bg-[#0f172a]
                  border border-white/10
                  shadow-xl
                  overflow-hidden
                "
              >
                <button
                  className="
                    w-full px-4 py-3
                    text-sm text-center
                    hover:bg-white/5
                    transition
                  "
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>

                <button
                  className="
                    w-full px-4 py-3
                    text-sm text-center
                    hover:bg-white/5
                    transition
                  "
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </button>

                <div className="h-px bg-white/10" />

                <button
                  className="
                    w-full px-4 py-3
                    text-sm text-center
                    text-red-400
                    hover:bg-white/5
                    transition
                  "
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default AppHeader;
