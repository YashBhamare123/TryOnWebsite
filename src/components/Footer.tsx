import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    name: "Yash Bhamare",
    email: "mc240041040@iiti.ac.in",
    linkedin: "https://www.linkedin.com/in/yash-bhamare-887a2a330/",
    github: "https://github.com/YashBhamare123",
  },
  {
    name: "Vansh Ruhela",
    email: "rajputvansh4391@gmail.com",
    linkedin: "https://www.linkedin.com/in/vansh-ruhela-707889262/",
    github: "https://github.com/ThunderBolt4931",
  },
  {
    name: "Satyam Ashtikar",
    email: "sattyashtikar@gmail.com",
    linkedin: "https://www.linkedin.com/in/satyam-ashtikar-22369331b/",
    github: "https://github.com/CoderSATTY",
  },
];

const Footer = () => {
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null);

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
              <a href="https://github.com/YashBhamare123/TryOnPort" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://cynaptics.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
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

        {/* Get in Touch Section */}
        <div className="mt-12">
          <h4 className="font-display font-semibold mb-4 text-foreground">Get in Touch</h4>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="group flex items-center gap-4">
                <span className="text-muted-foreground text-sm min-w-[140px]">{member.name}</span>
                <div className="flex gap-2 items-center">
                  {revealedEmail === member.name ? (
                    <span className="text-muted-foreground text-sm">{member.email}</span>
                  ) : (
                    <button
                      onClick={() => setRevealedEmail(member.name)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Reveal Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
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


