import type { Post } from "../../types/Posts";
import { formatDate } from "../../utils/formatDate";
import CategoryTag from "../CategoryTag/CategoryTag";
import styles from "./PostCard.module.scss"

function PostCard({ post }: { post: Post }) {
    return (
        <div className={styles.card}>
            <img src={post.thumbnail_url} alt={post.title} loading="lazy" className={styles.image} />

            <div className={styles.body}>
                <p className={styles.meta}>
                    <time>{formatDate(post.createdAt)}</time>
                    <span className={styles.dot} aria-hidden="true"></span>
                    <span>{post.author.name}</span>
                </p>

                <div className={styles.text}>
                    <h3 className={styles.title}>{post.title}</h3>
                    <p className={styles.excerpt}>{post.content}</p>
                </div>

                <ul className={styles.tags} aria-label="Categories">
                    {post.categories.map((category) => (
                    <li key={category.id}>
                        <CategoryTag category={category} />
                    </li>
                    ))}
                </ul>                
            </div>            
        </div>
    );
}

export default PostCard;