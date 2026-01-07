// import { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import AppHeader from "../components/AppHeader";
// import api from "../lib/api";
// import { UserContext } from "../context/UserContext";

// const WalkDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   const [walk, setWalk] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [showJoinPanel, setShowJoinPanel] = useState(false);
//   const [selectedDogs, setSelectedDogs] = useState([]);

//   const fetchWalk = async () => {
//     try {
//       const res = await api.get(`/api/v1/walks/${id}`);
//       setWalk(res.data.walk);
//     } catch (e) {
//       toast.error("Failed to load walk");
//       navigate("/walks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWalk();
//   }, [id]);

//   if (loading) {
//     return <div className="min-h-screen bg-black text-white">Loading…</div>;
//   }

//   if (!walk || !walk.host || !user) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         Failed to load walk
//       </div>
//     );
//   }
//   const userDogs = Array.isArray(user.dogs) ? user.dogs : [];
//   const hasDogs = userDogs.length > 0;

//   const isHost = walk.host?._id === user._id;

//   const isJoined = Array.isArray(walk.participants)
//     ? walk.participants.some((p) => p.user && p.user._id === user._id)
//     : false;

//   const isFull = (walk.participants?.length || 0) + 1 >= walk.maxParticipants;

//   const isCancelled = walk.status === "cancelled";

//   const toggleDog = (dogId) => {
//     setSelectedDogs((prev) =>
//       prev.includes(dogId)
//         ? prev.filter((id) => id !== dogId)
//         : [...prev, dogId]
//     );
//   };

//   const handleJoin = async () => {
//     console.log("selectedDogs before join:", selectedDogs);
//     if (selectedDogs.length === 0) {
//       toast.error("Please select at least one dog");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await api.post(`/api/v1/walks/${walk._id}/join`, {
//         dogs: selectedDogs,
//       });
//       toast.success("Joined walk");
//       setShowJoinPanel(false);
//       setSelectedDogs([]);
//       fetchWalk();
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Join failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLeave = async () => {
//     setSubmitting(true);
//     try {
//       await api.post(`/api/v1/walks/${walk._id}/leave`);
//       toast.success("Left walk");
//       setSelectedDogs([]);
//       setShowJoinPanel(false);
//       fetchWalk();
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Leave failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <AppHeader />

//       <main className="pt-20 max-w-4xl mx-auto px-4">
//         <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-lg">
//           <h1 className="text-4xl mb-2">Walk Details</h1>

//           <p className="text-sm text-gray-400 mb-1 ">
//             <span className="font-bold">Date & Time:</span>{" "}
//             {new Date(walk.time).toLocaleString()}
//           </p>

//           <p className="text-sm text-gray-300 mb-6">
//             <span className="font-bold">Location:</span>{" "}
//             {walk.location?.name || "Unknown location"}
//           </p>

//           <div className="mb-6">
//             <p className="text-sm text-gray-400 mb-2">Host</p>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 min-w-[120px]">
//                 <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center ring-2 ring-blue-500/50">
//                   {walk.host.avatarUrl ? (
//                     <img
//                       src={walk.host.avatarUrl}
//                       alt={walk.host.username}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-sm font-semibold">
//                       {walk.host.username?.[0]?.toUpperCase()}
//                     </span>
//                   )}
//                 </div>
//                 <span className="font-medium">{walk.host.username}</span>
//               </div>

//               <div className="flex gap-2 flex-wrap">
//                 {walk.dogs?.map((dog) => (
//                   <span
//                     key={dog._id}
//                     className="px-3 py-1 rounded-full bg-white/10 text-sm"
//                   >
//                     #{dog.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <p className="text-sm text-gray-400 mb-2">
//               Participants ({1 + (walk.participants?.length || 0)}/
//               {walk.maxParticipants})
//             </p>

//             <div className="flex flex-col gap-3">
//               {walk.participants?.map((p) => (
//                 <div key={p.user._id} className="flex items-center gap-4">
//                   <div className="flex items-center gap-2 min-w-[120px]">
//                     <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
//                       {p.user.avatarUrl ? (
//                         <img
//                           src={p.user.avatarUrl}
//                           alt={p.user.username}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-xs">
//                           {p.user.username?.[0]?.toUpperCase()}
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-sm">{p.user.username}</span>
//                   </div>

//                   <div className="flex gap-2 flex-wrap">
//                     {p.dogs?.length > 0 ? (
//                       p.dogs.map((dog) => (
//                         <span
//                           key={dog._id}
//                           className="px-3 py-1 rounded-full bg-white/10 text-sm"
//                         >
//                           #{dog.name}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-sm text-gray-500">No dogs</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6 flex gap-3">
//             {isCancelled && (
//               <span className="text-sm text-red-400">Cancelled</span>
//             )}

//             {!isCancelled && !isHost && !isJoined && !isFull && (
//               <>
//                 {!showJoinPanel ? (
//                   <button
//                     onClick={() => setShowJoinPanel(true)}
//                     className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold"
//                   >
//                     Join Walk
//                   </button>
//                 ) : (
//                   <div className="mt-4 p-4 border border-white/10 rounded-xl">
//                     <p className="text-sm text-gray-400 mb-2">
//                       Select dogs to join
//                     </p>

//                     <div className="flex gap-2 flex-wrap mb-4">
//                       {hasDogs ? (
//                         userDogs.map((dog) => (
//                           <button
//                             key={dog._id}
//                             onClick={() => toggleDog(dog._id)}
//                             className={`px-3 py-1 rounded-full text-sm border
//                     ${
//                       selectedDogs.includes(dog._id)
//                         ? "bg-blue-500 border-blue-500"
//                         : "bg-transparent border-white/20"
//                     }`}
//                           >
//                             #{dog.name}
//                           </button>
//                         ))
//                       ) : (
//                         <p className="text-sm text-gray-400">
//                           You don’t have any dogs yet.
//                           <span
//                             onClick={() => navigate("/settings")}
//                             className="ml-1 text-blue-400 hover:underline cursor-pointer"
//                           >
//                             Add a dog
//                           </span>
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex gap-3">
//                       <button
//                         onClick={handleJoin}
//                         disabled={submitting || !hasDogs}
//                         className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60"
//                       >
//                         Confirm Join
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowJoinPanel(false);
//                           setSelectedDogs([]);
//                         }}
//                         className="px-5 py-2 rounded-xl bg-gray-600 hover:bg-gray-700"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             {!isCancelled && !isHost && isJoined && (
//               <button
//                 onClick={handleLeave}
//                 disabled={submitting}
//                 className="px-6 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 font-semibold disabled:opacity-60"
//               >
//                 Leave Walk
//               </button>
//             )}

//             {/* Full */}
//             {!isCancelled && !isHost && !isJoined && isFull && (
//               <span className="text-sm text-gray-400">Walk is full</span>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default WalkDetailPage;
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader";
import api from "../lib/api";
import { UserContext } from "../context/UserContext";

const WalkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [walk, setWalk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState([]);

  const fetchWalk = async () => {
    try {
      const res = await api.get(`/api/v1/walks/${id}`);
      setWalk(res.data.walk);
    } catch (e) {
      toast.error("Failed to load walk");
      navigate("/walks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalk();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-black text-gray-400 p-8">Loading…</div>;
  }

  if (!walk || !walk.host || !user) {
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        Failed to load walk
      </div>
    );
  }

  const userDogs = Array.isArray(user.dogs) ? user.dogs : [];
  const hasDogs = userDogs.length > 0;

  const isHost = walk.host._id === user._id;
  const isJoined = walk.participants?.some(
    (p) => p.user && p.user._id === user._id
  );
  const isFull =
    (walk.participants?.length || 0) + 1 >= walk.maxParticipants;
  const isCancelled = walk.status === "cancelled";

  const toggleDog = (dogId) => {
    setSelectedDogs((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleJoin = async () => {
    if (selectedDogs.length === 0) {
      toast.error("Please select at least one dog");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/v1/walks/${walk._id}/join`, {
        dogs: selectedDogs,
      });
      toast.success("Joined walk");
      setShowJoinPanel(false);
      setSelectedDogs([]);
      fetchWalk();
    } catch (e) {
      toast.error(e.response?.data?.message || "Join failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async () => {
    setSubmitting(true);
    try {
      await api.post(`/api/v1/walks/${walk._id}/leave`);
      toast.success("Left walk");
      fetchWalk();
    } catch (e) {
      toast.error(e.response?.data?.message || "Leave failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-5xl mx-auto px-4">
        <div
          className="
            bg-[#111]
            border border-white/10
            rounded-3xl
            p-6
            shadow-lg
          "
        >
          {/* ---------- Header ---------- */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2">Walk Details</h1>

            <p className="text-sm text-gray-400">
              <span className="uppercase tracking-wide">Date & Time</span> ·{" "}
              {new Date(walk.time).toLocaleString()}
            </p>

            <p className="text-sm text-gray-300 mt-1">
              <span className="uppercase tracking-wide">Location</span> ·{" "}
              {walk.location?.name}
            </p>
          </div>

          {/* ---------- Host ---------- */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Host
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 min-w-[140px]">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                  {walk.host.avatarUrl ? (
                    <img
                      src={walk.host.avatarUrl}
                      alt={walk.host.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">
                      {walk.host.username[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <span className="font-medium">{walk.host.username}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {walk.dogs?.map((dog) => (
                  <span
                    key={dog._id}
                    className="
                      text-xs px-3 py-1 rounded-full
                      bg-blue-500/10
                      text-blue-300
                      border border-blue-500/20
                    "
                  >
                    #{dog.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Participants ---------- */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
              Participants ({1 + walk.participants.length}/{walk.maxParticipants})
            </p>

            <div className="flex flex-col gap-4">
              {walk.participants.map((p) => (
                <div key={p.user._id} className="flex items-start gap-4">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                      {p.user.avatarUrl ? (
                        <img
                          src={p.user.avatarUrl}
                          alt={p.user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">
                          {p.user.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="text-sm">{p.user.username}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {p.dogs.map((dog) => (
                      <span
                        key={dog._id}
                        className="
                          text-xs px-3 py-1 rounded-full
                          bg-blue-500/10
                          text-blue-300
                          border border-blue-500/20
                        "
                      >
                        #{dog.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Actions ---------- */}
          <div className="flex gap-3">
            {!isCancelled && !isHost && !isJoined && !isFull && (
              <>
                {!showJoinPanel ? (
                  <button
                    onClick={() => setShowJoinPanel(true)}
                    className="
                      px-6 py-2 rounded-xl
                      bg-blue-500 hover:bg-blue-600
                      font-semibold
                    "
                  >
                    Join Walk
                  </button>
                ) : (
                  <div className="w-full p-4 border border-white/10 rounded-xl">
                    <p className="text-sm text-gray-400 mb-3">
                      Select dogs to join
                    </p>

                    <div className="flex gap-2 flex-wrap mb-4">
                      {hasDogs ? (
                        userDogs.map((dog) => (
                          <button
                            key={dog._id}
                            onClick={() => toggleDog(dog._id)}
                            className={`
                              text-xs px-3 py-1 rounded-full border
                              ${
                                selectedDogs.includes(dog._id)
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-transparent border-white/20 text-gray-300"
                              }
                            `}
                          >
                            #{dog.name}
                          </button>
                        ))
                      ) : (
                        <span
                          className="text-sm text-blue-400 cursor-pointer"
                          onClick={() => navigate("/settings")}
                        >
                          Add a dog first →
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleJoin}
                        disabled={submitting}
                        className="
                          px-5 py-2 rounded-xl
                          bg-blue-500 hover:bg-blue-600
                          disabled:opacity-60
                        "
                      >
                        Confirm Join
                      </button>

                      <button
                        onClick={() => {
                          setShowJoinPanel(false);
                          setSelectedDogs([]);
                        }}
                        className="
                          px-5 py-2 rounded-xl
                          bg-white/10 hover:bg-white/20
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!isCancelled && !isHost && isJoined && (
              <button
                onClick={handleLeave}
                disabled={submitting}
                className="
                  px-6 py-2 rounded-xl
                  bg-white/10 hover:bg-white/20
                "
              >
                Leave Walk
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalkDetailPage;
