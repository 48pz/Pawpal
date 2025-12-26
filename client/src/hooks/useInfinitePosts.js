import { useEffect, useRef, useState } from "react";
import { mockPosts } from "../mock/posts";

const PAGE_SIZE = 10;

const useInfinitePosts = () => {
  const [posts, setPosts] = useState(mockPosts.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loaderRef = useRef(null);
  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const start = pageRef.current * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const nextPosts = mockPosts.slice(start, end);

    if (nextPosts.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setPosts((prev) => [...prev, ...nextPosts]);
    pageRef.current += 1;
    setPage(pageRef.current);
    setLoading(false);
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
