import AppHeader from "../components/AppHeader";
import CreatePost from "../components/post/CreatePost";
import PostCard from "../components/post/PostCard";
import useInfinitePosts from "../hooks/useInfinitePosts";
import Footer from "../components/layout/Footer";

const PostPage = () => {
  const { posts, loaderRef, loading, hasMore, refreshPosts } =
    useInfinitePosts();
  console.log("posts", posts);
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="pt-20 max-w-4xl mx-auto px-4">
        {/* create post */}
        <CreatePost onPostCreated={refreshPosts} />
        {/* post list */}
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {hasMore && (
          <div ref={loaderRef} className="text-center text-gray-500 mt-6">
            {loading ? "Loading..." : "Scroll to load more"}
          </div>
        )}
        {!hasMore && (
          <div className="text-center text-gray-500 mt-6">
            You’ve reached the end
          </div>
        )}

        <div className="flex justify-center">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default PostPage;
