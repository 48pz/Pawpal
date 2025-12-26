const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-900 p-4 rouned">
      <div className="text-sm text-gray-400 mb-2">{post.author}</div>
      <div>{post.content}</div>
    </div>
  );
};

export default PostCard;
