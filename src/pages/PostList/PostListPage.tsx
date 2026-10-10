import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostListPage.module.scss";
import { usePosts } from "../../hooks/usePosts";
import NotFound from "../../components/NotFound/NotFound";
import { ErrorState } from "../../components/ErrorState/ErrorState";
import { Loading } from "../../components/Loading/Loading";
import { filterPosts, useFilters } from "../../features/filters";
import { useMemo } from "react";

function PostListPage() {
    const {posts, loading, error} = usePosts()
    

    if (loading) return <Loading fullPage size="xl"></Loading>;
    if (error?.status === 404) return <NotFound />;
    if (error) return <ErrorState error={error} headingLevel={1} />;
    if (!posts) return null;

    const filters = useFilters();
    const visiblePosts = useMemo(
        () => filterPosts(posts ?? [], filters),
        [posts, filters],
    );

    return (
        <div className={styles.grid}>
            {visiblePosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
    );
}

export default PostListPage;