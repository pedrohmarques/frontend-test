import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Post } from "../../types/Posts";
import { usePost } from "../../hooks/usePost";
import { formatDate } from "../../utils/formatDate";
import styles from "./PostDetailPage.module.scss";
import PostCard from "../../components/PostCard/PostCard";
import { usePosts } from "../../hooks/usePosts";
import { ArrowLeft } from "lucide-react";
import NotFound from "../../components/NotFound/NotFound";
import { ErrorState } from "../../components/ErrorState/ErrorState";
import { Loading } from "../../components/Loading/Loading";

function PageDetailPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const initialPost = (location.state as { post?: Post } | null)?.post;
    const { post, loading, error } = usePost(id, initialPost);    
    const { posts } = usePosts();


    if (loading) return <Loading fullPage size="xl"></Loading>;
    if (error?.status === 404) return <NotFound />;
    if (error) return <ErrorState error={error} headingLevel={1} />;
    if (!post) return null;


    const paragraphs = post.content.split('\n\n');
    const latest = (posts ?? []).filter((p) => p.id !== post.id).slice(0, 3)
    return (
        <div className={styles.page}>
            <div className={styles.back}>
                <button type="button" className="button secondary" onClick={() => navigate(-1)}> <ArrowLeft  size={16}/> Back</button>
            </div>
            <div className={styles.article}>
                <h1 className={styles.title}>{post.title}</h1>

                <div className={styles.author}>
                    <img src={post.author.profilePicture} alt="Author" className={styles.avatar} />
                    <div className={styles.authorInfo}>
                        <span>Written by: <span className={styles.authorName}>{post.author.name}</span></span>
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                    </div>                    
                </div>

                <img src={post.thumbnail_url} alt={post.title} className={styles.cover}/>
                <div className={styles.content}>
                    {paragraphs.map((text, i) => (
                        <p key={i}>{text}</p>
                    ))}
                </div>
            </div>

            {latest.length > 0 && (
                <section className={styles.latest} aria-labelledby="latest-title">
                    <h2 id="latest-title" className={styles.latestTitle}>Latest articles</h2>
                    <ul className={styles.latestGrid}>
                        {latest.map((p) => (
                            <li key={p.id}>
                                <PostCard post={p} />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );

}

export default PageDetailPage;