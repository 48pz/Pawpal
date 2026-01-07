import { Link } from "react-router-dom";

const categoryBadge = (key) => {
  const map = {
    breeds: "bg-purple-500/10 text-purple-300",
    health: "bg-emerald-500/10 text-emerald-300",
    training: "bg-blue-500/10 text-blue-300",
    nutrition: "bg-amber-500/10 text-amber-300",
    guides: "bg-gray-500/10 text-gray-300",
  };
  return map[key] || "bg-gray-500/10 text-gray-300";
};

export default function PawpediaCard({ article }) {
  return (
    <Link
      to={`/pawpedia/${article.slug}`}
      className="
        block
        bg-[#0b1220]
        rounded-2xl
        border border-white/5
        p-5
        hover:border-white/10
        hover:opacity-95
        transition
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge(
                article.category
              )}`}
            >
              {article.category}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white truncate">
            {article.title}
          </h3>

          {article.summary && (
            <p className="text-sm text-gray-300 mt-2 line-clamp-2">
              {article.summary}
            </p>
          )}

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-20 h-20 rounded-xl object-cover border border-white/5"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 text-xs">
            Pawpedia
          </div>
        )}
      </div>
    </Link>
  );
}
