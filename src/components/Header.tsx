import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground">
          Junebird
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="group relative flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all border border-primary"
          >
            <ShoppingBag size={16} />
            <span>Cart ({totalItems})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
