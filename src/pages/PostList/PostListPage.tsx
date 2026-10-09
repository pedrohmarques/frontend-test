import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostListPage.module.scss";
import { usePosts } from "../../hooks/usePosts";

function PostListPage() {
    const {posts} = usePosts()

    return (
        <div className={styles.grid}>
            {posts && posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostListPage;