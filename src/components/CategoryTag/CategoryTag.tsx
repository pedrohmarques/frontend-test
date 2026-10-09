import type { Category } from "../../types/Category";
import styles from "./CategoryTag.module.scss";

function CategoryTag({ category }: { category: Category }) {
    return <span className={styles.tag}>{category.name}</span>;
}

export default CategoryTag;