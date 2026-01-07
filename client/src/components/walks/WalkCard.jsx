// import { useNavigate } from "react-router-dom";
// import Button from "../Button";

// const WalkCard = ({ walk }) => {
//   const navigate = useNavigate();

//   const date = new Date(walk.time);
//   const timeText = date.toLocaleString();

//   const host = walk.host;
//   const avatarUrl = host?.avatarUrl || host?.avatar;

//   return (
//     <div className="bg-[#111] border border-white/10 rounded-3xl p-5 shadow-lg">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <div>
//           <p className="text-sm text-gray-400">Date & Time: {timeText}</p>
//           <p className="text-sm text-gray-300 mt-1 truncate">
//             Location: {walk.location?.name}
//           </p>
//         </div>

//         <span className="text-xs text-gray-400">
//           {walk.participants.length}/{walk.maxParticipants}
//         </span>
//       </div>

//       {/* Host */}
//       <div className="flex items-center gap-3 mb-4">
//         {/* Avatar */}
//         <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
//           {avatarUrl ? (
//             <img
//               src={avatarUrl}
//               alt={host?.username || "user avatar"}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <span className="text-sm font-semibold text-white">
//               {host?.username?.[0]?.toUpperCase() || "U"}
//             </span>
//           )}
//         </div>

//         <span className="text-sm text-gray-200">{host?.username}</span>
//       </div>

//       {/* Dogs */}
//       {walk.dogs?.length > 0 && (
//         <div className="flex gap-2 flex-wrap mb-4">
//           {walk.dogs.map((d) => (
//             <span
//               key={d._id}
//               className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300"
//             >
//               # {d.name}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex justify-end">
//         <Button
//           onClick={() => navigate(`/walks/${walk._id}`)}
//           className="text-sm text-blue-400"
//           variant="link"
//         >
//           View details
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default WalkCard;

import { useNavigate } from "react-router-dom";
import Button from "../Button";

const WalkCard = ({ walk }) => {
  const navigate = useNavigate();

  const date = new Date(walk.time);
  const timeText = date.toLocaleString();

  const host = walk.host;
  const avatarUrl = host?.avatarUrl || host?.avatar;

  return (
    <div
      className="
      bg-gradient-to-br from-[#121826] to-[#0b0f1a]
      border border-white/10
      rounded-3xl
      p-6
      shadow-lg
      hover:border-blue-500/30
      transition
    "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <p className="text-sm text-blue-300">📅 {timeText}</p>
          <p className="text-sm text-gray-400 truncate max-w-[80%]">
            📍 {walk.location?.name}
          </p>
        </div>

        {/* Capacity */}
        <div
          className="
          px-3 py-1
          rounded-full
          text-xs
          bg-blue-500/10
          text-blue-300
          border border-blue-500/20
        "
        >
          {walk.participants.length}/{walk.maxParticipants}
        </div>
      </div>

      {/* Host */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="
          w-9 h-9
          rounded-full
          bg-white/10
          overflow-hidden
          flex items-center justify-center
          ring-2 ring-blue-500/30
        "
        >
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

        <span className="text-sm text-gray-200">{host?.username}</span>
      </div>

      {/* Dogs */}
      {walk.dogs?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          {walk.dogs.map((d) => (
            <span
              key={d._id}
              className="
                text-xs
                px-3 py-1
                rounded-full
                bg-emerald-500/10
                text-emerald-300
                border border-emerald-500/20
              "
            >
              🐾 {d.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(`/walks/${walk._id}`)}
          className="
            text-sm
            text-blue-300
            hover:text-blue-200
          "
          variant="link"
        >
          View details
        </Button>
      </div>
    </div>
  );
};

export default WalkCard;
