import { useState, useMemo } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import MenuCard from "@/components/MenuCard";
import { motion } from "framer-motion";
import { useMenuData } from "@/hooks/useMenuData";
import { Skeleton } from "@/components/ui/skeleton";

const MenuCardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-1/3 rounded-none" />
      <Skeleton className="h-6 w-2/3 rounded-none" />
    </div>
  </div>
);

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { menuItems, categories, loading, error } = useMenuData();

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1"
    >
      {/* Hero Heading */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 tracking-tight">
          Clean Food You Will Love To Eat
        </h1>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        )}
        {error && (
          <p className="text-center text-red-500 py-20 text-lg">
            Error: {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <div
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  category={item.category}
                  image={item.image}
                  isNew={item.isNew}
                  index={index}
                />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <p className="text-center text-muted-foreground py-20 text-lg">
                No items found in this category.
              </p>
            )}
          </>
        )}
      </section>
    </motion.div>
  );
};

export default Index;
