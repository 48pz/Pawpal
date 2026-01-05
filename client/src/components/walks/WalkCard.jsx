import { useNavigate } from "react-router-dom";

const WalkCard = ({ walk }) => {
  const navigate = useNavigate();

  const date = new Date(walk.time);
  const timeText = date.toLocaleString();

  const host = walk.host;
  const avatarUrl = host?.avatarUrl || host?.avatar;

  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">🕒 {timeText}</p>
          <p className="text-sm text-gray-300 mt-1 truncate">
            📍 {walk.location?.name}
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {walk.participants.length}/{walk.maxParticipants}
        </span>
      </div>

      {/* Host */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={host?.username || "user avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {host?.username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>

        <span className="text-sm text-gray-200">
          {host?.username}
        </span>
      </div>

      {/* Dogs */}
      {walk.dogs?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {walk.dogs.map((d) => (
            <span
              key={d._id}
              className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300"
            >
              # {d.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/walks/${walk._id}`)}
          className="text-sm text-blue-400 hover:underline"
        >
          View details →
        </button>
      </div>
    </div>
  );
};

export default WalkCard;
