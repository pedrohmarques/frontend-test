import type { Post } from "../types/Posts";
import CategoryTag from "./CategoryTag";

function PostCard({ post }: { post: Post }) {
    return (
        <div>
            <img src={post.thumbnail_url} alt={post.title} />
            <div>
                <h2>{post.updatedAt}</h2>
                <p>{post.author.name}</p>
            </div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.categories.map((category) => (
                <CategoryTag key={category.id} category={category} />
            ))}
        </div>
    );
}

export default PostCard;