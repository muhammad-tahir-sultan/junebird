export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryOrder?: number;
  image: string;
  isNew: boolean;
  description: string;
  price: number;
}
