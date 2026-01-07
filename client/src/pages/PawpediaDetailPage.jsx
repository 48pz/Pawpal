import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Footer from "../components/layout/Footer";
import api from "../lib/api";

const blockView = (b, idx) => {
  if (b.type === "heading") {
    return (
      <h2 key={idx} className="text-xl font-semibold mt-6">
        {b.text}
      </h2>
    );
  }

  if (b.type === "paragraph") {
    return (
      <p
        key={idx}
        className="text-sm text-gray-200 leading-relaxed mt-3 whitespace-pre-wrap"
      >
        {b.text}
      </p>
    );
  }

  if (b.type === "bullets") {
    return (
      <ul
        key={idx}
        className="list-disc pl-5 text-sm text-gray-200 mt-3 space-y-1"
      >
        {(b.items || []).map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  }

  if (b.type === "warning") {
    return (
      <div
        key={idx}
        className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
      >
        <div className="font-semibold mb-1">Warning</div>
        <div className="text-red-100/90">{b.text}</div>
      </div>
    );
  }

  if (b.type === "note") {
    return (
      <div
        key={idx}
        className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200"
      >
        <div className="font-semibold mb-1">Note</div>
        <div className="text-gray-200/90">{b.text}</div>
      </div>
    );
  }

  return null;
};

export default function PawpediaDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/pawpedia/${slug}`);
        setArticle(res.data.article);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/pawpedia"
            className="text-sm text-cyan-300 hover:text-cyan-200"
          >
            ← Back to Pawpedia
          </Link>
        </div>

        {loading && <div className="text-gray-500">Loading...</div>}

        {!loading && !article && (
          <div className="text-gray-500">Article not found.</div>
        )}

        {!loading && article && (
          <div className="bg-[#0b1220] rounded-2xl border border-white/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">
                  {article.category} •{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <h1 className="text-3xl font-bold mt-2">{article.title}</h1>
                {article.summary && (
                  <p className="text-sm text-gray-300 mt-3">
                    {article.summary}
                  </p>
                )}
              </div>

              {article.coverImageUrl ? (
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  className="w-24 h-24 rounded-xl object-cover border border-white/5"
                />
              ) : null}
            </div>

            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-white/5 pt-4">
              {(article.contentBlocks || []).map((b, idx) => blockView(b, idx))}
            </div>

            <div className="mt-8 text-xs text-gray-400 border-t border-white/5 pt-4">
              This content is for general information only and does not replace
              professional veterinary advice.
            </div>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Footer />
        </div>
      </main>
    </div>
  );
}
