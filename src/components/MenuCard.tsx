import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  isNew?: boolean;
  index: number;
}

const MenuCard = ({
  id,
  slug,
  name,
  category,
  image,
  isNew = false,
  index,
}: MenuCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${slug}`)}
      className="menu-card group opacity-0 animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="menu-card-image group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge-category">{category}</span>
          {isNew && <span className="badge-new">New</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground leading-tight">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default MenuCard;
