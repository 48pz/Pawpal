import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader";
import WalkCard from "../components/walks/WalkCard";
import api from "../lib/api";

const WalksPage = () => {
  const navigate = useNavigate();
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/walks");
        setWalks(res.data.walks || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load walks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Walks
          </h1>

          <button
            onClick={() => navigate("/walks/new")}
            className="rounded-xl bg-blue-500 hover:bg-blue-600 px-5 py-2 text-sm font-semibold"
          >
            Add Walk
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400">Loading walks...</p>
        ) : walks.length === 0 ? (
          <div className="text-gray-400 text-sm">No upcoming walks yet.</div>
        ) : (
          <div className="grid gap-6">
            {walks.map((w) => (
              <WalkCard key={w._id} walk={w} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WalksPage;
