const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-semibold mb-4">Junebird</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Good, clean food for all. An extension of Junebird, the modern lifestyle brand.
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Menu</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Locations</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">About Us</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Catering</a>
            </div>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Instagram</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Twitter</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">© 2025 Junebird. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
