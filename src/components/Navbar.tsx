import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/docs", label: "Documentation" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-6">
      <div className="max-w-4xl mx-auto rounded-full shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'hsl(25, 10%, 12%)' }}>
        <div className="flex items-center justify-between h-16 px-6 relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/attira-logo.png" alt="Attira" className="w-12 h-12 object-contain" />
            <span
              className="font-display font-semibold text-3xl tracking-tight text-gradient"
            >
              Attira
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                {isActive(link.path) ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {link.label}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    {link.label}
                  </Button>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="https://tryon-beige.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="gradient"
                size="sm"
                className="uppercase tracking-[0.15em] font-semibold"
              >
                Launch App
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-2xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive(link.path) ? (
                    <Button variant="default" className="w-full justify-start bg-primary hover:bg-primary/90">
                      {link.label}
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full justify-start">
                      {link.label}
                    </Button>
                  )}
                </Link>
              ))}
              <a href="https://tryon-beige.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gradient" className="w-full mt-2 uppercase tracking-[0.15em] font-semibold">
                  Launch App
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
