import { NavLink, useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();
  return (
    // fixed top-0 left-0 right-0: Pin the elements to the top of the container and fill them horizontally.
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-50">
      <div className="flex items-center justify-between px-6 max-w-6xl mx-auto h-full">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          style={{ fontFamily: "'Baloo 2',cursive" }}
          onClick={() => navigate("/post")}
        >
          PawPal
        </div>

        <nav className="flex items-center gap-20">
          <NavLink
            to="/post"
            className={({ isActive }) => {
              `font-semibold text-sm transition ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`;
            }}
          >
            Feed
          </NavLink>
          <NavLink
            to="/walks"
            className={({ isActive }) => {
              `font-semibold text-sm transition ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`;
            }}
          >
            Walks
          </NavLink>
          <NavLink
            to="/questions"
            className={({ isActive }) => {
              `font-semibold text-sm transition ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`;
            }}
          >
            Community
          </NavLink>
        </nav>

        <div className="flex items-center gap-5">
          {/* notification */}
          <div className="text-gray-400 hover:text-white cursor-pointer">
            🔔
          </div>
          {/* avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-600 cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
