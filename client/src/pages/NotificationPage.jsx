import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Footer from "../components/layout/Footer";
import api from "../lib/api";

const NotificationPage = () => {
  const [active, setActive] = useState("activity");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/v1/notification").then((res) => {
      setNotifications(res.data);
    });

    api.patch("/api/v1/notification/read-all").catch(() => {});
  }, []);

  const getNotificationText = (n) => {
    switch (n.type) {
      case "like":
        return `${n.sender.username} liked your post`;
      case "comment":
        return `${n.sender.username} commented on your post`;
      case "reply":
        return `${n.sender.username} replied to your comment`;
      default:
        return "You have a new notification";
    }
  };

  const handleNotificationClick = async (n) => {
    await api.patch(`/api/v1/notification/${n._id}/read`);

    navigate(`/posts/${n.post._id}`, {
      state: { openComments: true },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-4xl mx-auto px-4">
        {/* title */}
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

        {/* tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActive("activity")}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${
                active === "activity"
                  ? "bg-cyan-500 text-black"
                  : "bg-[#111] text-gray-400 hover:text-white"
              }
            `}
          >
            Activity
          </button>

          <button
            onClick={() => setActive("messages")}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition
              ${
                active === "messages"
                  ? "bg-cyan-500 text-black"
                  : "bg-[#111] text-gray-400 hover:text-white"
              }
            `}
          >
            Messages
          </button>
        </div>

        {/* activity */}
        {active === "activity" && (
          <div className="flex flex-col gap-4">
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500">No notifications yet</p>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                className={`rounded-xl p-4 cursor-pointer ${
                  n.read ? "bg-[#020617]" : "bg-[#0b1c3d]"
                }`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="text-white text-sm">
                  {getNotificationText(n)}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* messages（先占位） */}
        {active === "messages" && (
          <div className="text-sm text-gray-500">Messages coming soon 👀</div>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
