import { useEffect, useState } from "react";
import { getPosts } from "../services/posts.service";
import type { Post } from "../types/Posts";
import PostCard from "../components/PostCard";

function PostListPage() {

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        getPosts().then((posts) => {
            setPosts(posts);
        });
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostListPage;