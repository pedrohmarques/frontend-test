import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostListPage.module.scss";
import { usePosts } from "../../hooks/usePosts";
import NotFound from "../../components/NotFound/NotFound";
import { ErrorState } from "../../components/ErrorState/ErrorState";
import { Loading } from "../../components/Loading/Loading";

function PostListPage() {
    const {posts, loading, error} = usePosts()

    if (loading) return <Loading fullPage size="xl"></Loading>;
    if (error?.status === 404) return <NotFound />;
    if (error) return <ErrorState error={error} headingLevel={1} />;
    if (!posts) return null;

    return (
        <div className={styles.grid}>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostListPage;