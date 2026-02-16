import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { MenuItem } from "@/data/menuItems";


interface UseMenuDataReturn {
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

export const useMenuData = (): UseMenuDataReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all category documents from the 'menu' collection
        const menuCollection = collection(db, "menu");
        const categorySnapshot = await getDocs(menuCollection);

        const allItems: MenuItem[] = [];
        const categoryNames: string[] = ["All"];

        // Sort category docs by categoryOrder
        const sortedCategoryDocs = categorySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort(
            (a: any, b: any) =>
              (a.categoryOrder ?? 99) - (b.categoryOrder ?? 99),
          );

        // 2. For each category, fetch its 'items' subcollection
        for (const categoryDoc of sortedCategoryDocs) {
          const categoryName = (categoryDoc as any).category ?? categoryDoc.id;
          categoryNames.push(categoryName);

          const itemsCollection = collection(
            db,
            "menu",
            categoryDoc.id,
            "items",
          );
          const itemsSnapshot = await getDocs(itemsCollection);

          const items: MenuItem[] = itemsSnapshot.docs.map((itemDoc) => {
            const data = itemDoc.data();

            return {
              id: itemDoc.id,
              slug: data.slug ?? "",
              name: data.name ?? "",
              category: categoryName, // Category comes from the parent document
              categoryOrder: (categoryDoc as any).categoryOrder ?? 99,
              image: data.image_url ?? "",
              isNew: data.isNew ?? false,
              description: data.description ?? "",
              price:
                typeof data.price === "string"
                  ? parseFloat(data.price) || 0
                  : Number(data.price) || 0,
            };
          });

          allItems.push(...items);
        }

        setCategories(categoryNames);
        setMenuItems(allItems);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load menu items.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return { menuItems, categories, loading, error };
};
