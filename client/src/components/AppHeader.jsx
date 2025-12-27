import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../lib/api";

const AppHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await api.post("/api/v1/auth/logout");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-50">
      <div className="flex items-center justify-between px-6 max-w-6xl mx-auto h-full">
        {/* Logo */}
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          style={{ fontFamily: "'Baloo 2', cursive" }}
          onClick={() => navigate("/post")}
        >
          PawPal
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-20">
          {[
            { to: "/post", label: "Feed" },
            { to: "/walks", label: "Walks" },
            { to: "/questions", label: "Community" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-semibold text-sm transition ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          {/* notification */}
          <div className="text-gray-400 hover:text-white cursor-pointer">
            🔔
          </div>

          {/* avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer border-2
             hover:bg-gray-800 transition"
            >
              <div
                className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center
                  text-white text-sm font-semibold"
              >
                N/A
              </div>
              <span className="text-gray-400 text-2xl select-none">▾</span>
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                  onClick={() => {
                    setOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </button>

                <div className="border-t border-gray-700" />

                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
