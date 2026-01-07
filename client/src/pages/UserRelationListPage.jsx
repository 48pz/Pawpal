import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import AppHeader from "../components/AppHeader";
import { useUser } from "../context/useUser";

const UserRelationListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  const isFollowers = location.pathname.endsWith("followers");
  const title = isFollowers ? "Followers" : "Following";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?._id) return;

    const endpoint = isFollowers
      ? `/api/v1/user/${currentUser._id}/followers`
      : `/api/v1/user/${currentUser._id}/followings`;

    setLoading(true);

    api
      .get(endpoint)
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => {
        console.error("Failed to load user relations", err);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isFollowers, currentUser?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-10">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-3xl mx-auto px-6">
        <h1 className="text-xl font-bold mb-6">{title}</h1>

        {users.length === 0 && <p className="text-gray-500">No users</p>}

        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="
                flex items-center gap-4
                p-3 rounded-lg
                hover:bg-white/5
                cursor-pointer
              "
            >
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              <span className="font-medium">{user.username}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserRelationListPage;
