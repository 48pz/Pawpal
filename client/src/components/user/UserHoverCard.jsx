import { useEffect, useState } from "react";
import api from "../../lib/api";
import Button from "../Button";
import { useUser } from "../../context/useUser";
import { useNavigate } from "react-router-dom";

const UserHoverCard = ({ userId, onClose }) => {
  const { user: currentUser, fetchMe } = useUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api.get(`/api/v1/user/${userId}/hover`).then((res) => {
      if (mounted) {
        setData(res.data.user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [userId]);


  const handleToggleFollow = async () => {
    if (!data) return;

    try {
      if (data.isFollowing) {
        await api.post(`/api/v1/user/${userId}/unfollow`);
      } else {
        await api.post(`/api/v1/user/${userId}/follow`);
      }

      await fetchMe();

      setData((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  if (loading || !data) return null;

  return (
    <div
      className="
        w-64 p-4
        rounded-xl
        bg-[#0f172a]
        border border-white/10
        shadow-xl
      "
    >
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${data._id}`)}
      >
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-white">
              {data.username?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-white">{data.username}</p>
          <p className="text-xs text-gray-400">
            {data.followersCount} followers · {data.followingsCount} following
          </p>
        </div>
      </div>

      {data.dogs.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {data.dogs.map((dog) => (
            <span
              key={dog._id}
              className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full"
            >
              #{dog.name}
            </span>
          ))}
        </div>
      )}

      {currentUser?._id !== data._id && (
        <Button size="sm" className="w-full mt-4" onClick={handleToggleFollow}>
          {data.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default UserHoverCard;
