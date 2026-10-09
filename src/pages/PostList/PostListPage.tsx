import { useEffect, useState } from "react";
import { getPosts } from "../../services/posts.service";
import type { Post } from "../../types/Posts";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostListPage.module.scss";

function PostListPage() {

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        getPosts().then((posts) => {
            setPosts(posts);
        });
    }, []);

    return (
        <div className={styles.grid}>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostListPage;