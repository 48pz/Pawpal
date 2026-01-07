import { useEffect, useState } from "react";
import api from "../lib/api";

export default function usePawpedia({ category = "", q = "" } = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPage = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/pawpedia", {
        params: {
          category: category || undefined,
          q: q || undefined,
          page: pageNum,
          limit: 10,
        },
      });

      const { articles: newItems, hasMore: more } = res.data;

      setArticles((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(more);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, q]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    await fetchPage(page + 1);
  };

  return { articles, loading, hasMore, loadMore };
}
