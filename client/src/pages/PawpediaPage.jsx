import { useEffect, useMemo, useRef, useState } from "react";
import AppHeader from "../components/AppHeader";
import Footer from "../components/layout/Footer";
import Input from "../components/Input";
import usePawpedia from "../hooks/usePawpedia";
import PawpediaCard from "../components/pawpedia/PawpediaCard";
import api from "../lib/api";

export default function PawpediaPage() {
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);

  const { articles, loading, hasMore, loadMore } = usePawpedia({ category, q });

  const loaderRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await api.get("/api/v1/pawpedia/meta/categories");
      setCategories(res.data.categories || []);
    })();
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) loadMore();
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loading, loadMore]);

  const pills = useMemo(
    () => [{ key: "", label: "All" }, ...categories],
    [categories]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">Pawpedia</h1>
          <p className="text-sm text-gray-400 mt-2">
            Bite-sized dog knowledge. Clear, practical, and easy to browse.
          </p>
        </div>

        <div className="bg-[#0b1220] rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <Input
                placeholder="Search breeds, training, health..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {pills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setCategory(p.key)}
                  className={`
                    text-xs px-3 py-1 rounded-full border transition
                    ${
                      category === p.key
                        ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                    }
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((a) => (
            <PawpediaCard key={a._id} article={a} />
          ))}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="text-center text-gray-500 mt-8">
            {loading ? "Loading..." : "Scroll to load more"}
          </div>
        )}

        {!hasMore && (
          <div className="text-center text-gray-500 mt-8">
            You’ve reached the end
          </div>
        )}
      </main>
    </div>
  );
}
