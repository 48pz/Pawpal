import { useEffect, useState } from "react";
import api from "../lib/api";
import AppHeader from "../components/AppHeader";
import { FaDog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    if (!user) return;
    console.log("Profile user:", user);
    const fetchDogs = async () => {
      try {
        const res = await api.get("/api/v1/dog");
        setDogs(res.data.dogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDogs();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white p-10">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-6xl mx-auto px-4 space-y-8">
        {/* Profile Header */}
        <section
          className="
            flex items-center gap-6
            bg-[#0b1220]
            border border-white/5
            rounded-2xl
            p-5
          "
        >
          {/* avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {user.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {/* user info */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-lg font-semibold">{user.username}</span>
            <span className="text-sm text-gray-400">{user.email}</span>

            {user.bio && (
              <span className="text-sm text-gray-300 mt-1">{user.bio}</span>
            )}

            {/* followers / following */}
            <div className="flex gap-6 mt-2 text-sm text-gray-400">
              <button
                className="hover:text-white transition"
                onClick={() => navigate("/profile/followers")}
              >
                <span className="text-white font-medium mr-1">
                  {user.followersCount ?? 0}
                </span>
                Followers
              </button>

              <button
                className="hover:text-white transition"
                onClick={() => navigate("/profile/followings")}
              >
                <span className="text-white font-medium mr-1">
                  {user.followingsCount ?? 0}
                </span>
                Following
              </button>
            </div>
          </div>
        </section>

        {/* My Dogs */}
        <section>
          <h2 className="text-lg font-semibold mb-4">My Dogs</h2>

          {dogs.length === 0 ? (
            <p className="text-sm text-gray-500">No dogs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dogs.map((dog) => (
                <div
                  key={dog._id}
                  className="
                    flex items-center gap-4
                    bg-[#0b1220]
                    border border-white/5
                    rounded-2xl
                    p-4
                  "
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                    {dog.avatarUrl ? (
                      <img
                        src={dog.avatarUrl}
                        alt="dog avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaDog className="text-lg text-white/70" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium">{dog.name}</span>
                    <span className="text-xs text-gray-400">
                      {dog.breed || "Unknown breed"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Age: {dog.age ?? "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
