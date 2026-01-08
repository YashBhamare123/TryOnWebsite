import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/attira-logo.png" alt="Attira" className="w-9 h-9" />
              <span className="font-display font-semibold text-lg">Attira</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              State-of-the-art virtual try-on technology powered by
              advanced AI and computer vision. Transform the way people shop for fashion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/try" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Try Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Documentation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/docs#pipeline" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Pipeline
                </Link>
              </li>
              <li>
                <Link to="/docs#optimization" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Optimizations
                </Link>
              </li>
              <li>
                <Link to="/docs#deployment" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Deployment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Attira. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with PyTorch, Hugging Face & Modal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
