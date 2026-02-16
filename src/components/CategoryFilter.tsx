interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`category-pill ${activeCategory === category ? "category-pill-active" : "category-pill-inactive"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
