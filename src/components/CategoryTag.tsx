import type { Category } from "../types/Category";

function CategoryTag({ category }: { category: Category }) {
    return (
        <div>
            <h2>{category.name}</h2>
        </div>
    );
}

export default CategoryTag;