import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
const PAGE_SIZE = 10;

const useInfinitePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loaderRef = useRef(null);
  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await api.get("/api/v1/posts", {
        params: {
          page: pageRef.current,
          limit: PAGE_SIZE,
        },
      });

      const { posts: newPosts, hasMore: more } = res.data;
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        pageRef.current += 1;
        setHasMore(more);
      }
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMore();
      }
    });

    const current = loaderRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  return {
    posts,
    loaderRef,
    loading,
    hasMore,
  };
};

export default useInfinitePosts;
