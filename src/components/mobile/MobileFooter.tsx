import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Linkedin, ChevronDown } from "lucide-react";
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

const MobileFooter = () => {
    const [revealedEmail, setRevealedEmail] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <footer className="bg-card border-t border-border py-10">
            <div className="container mx-auto px-4">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-3">
                        <img src="/attira-logo.png" alt="Attira" className="w-8 h-8" />
                        <span className="font-display font-semibold text-lg">Attira</span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-4">
                        State-of-the-art virtual try-on technology powered by advanced AI.
                    </p>
                    <div className="flex justify-center gap-3">
                        <a
                            href="https://github.com/YashBhamare123/TryOnPort"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://cynaptics.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Collapsible Navigation */}
                <div className="border-t border-border pt-6 space-y-2">
                    {/* Navigation Section */}
                    <button
                        onClick={() => toggleSection('nav')}
                        className="w-full flex items-center justify-between py-3 text-foreground font-display font-semibold"
                    >
                        Navigation
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'nav' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'nav' && (
                        <div className="pb-3 pl-4 space-y-2">
                            <Link to="/" className="block text-muted-foreground hover:text-foreground transition-colors text-sm py-1">
                                Home
                            </Link>
                            <Link to="/docs" className="block text-muted-foreground hover:text-foreground transition-colors text-sm py-1">
                                Documentation
                            </Link>
                        </div>
                    )}

                    {/* Documentation Section */}
                    <button
                        onClick={() => toggleSection('docs')}
                        className="w-full flex items-center justify-between py-3 text-foreground font-display font-semibold border-t border-border"
                    >
                        Documentation
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'docs' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'docs' && (
                        <div className="pb-3 pl-4 space-y-2">
                            <Link to="/docs#pipeline" className="block text-muted-foreground hover:text-foreground transition-colors text-sm py-1">
                                Pipeline
                            </Link>
                            <Link to="/docs#optimization" className="block text-muted-foreground hover:text-foreground transition-colors text-sm py-1">
                                Optimizations
                            </Link>
                            <Link to="/docs#deployment" className="block text-muted-foreground hover:text-foreground transition-colors text-sm py-1">
                                Deployment
                            </Link>
                        </div>
                    )}
                </div>

                {/* Get in Touch Section */}
                <div className="border-t border-border pt-6 mt-4">
                    <h4 className="font-display font-semibold mb-4 text-foreground text-center">Get in Touch</h4>
                    <div className="space-y-3">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                                <span className="text-muted-foreground text-sm">{member.name}</span>
                                <div className="flex gap-3">
                                    {revealedEmail === member.name ? (
                                        <span className="text-muted-foreground text-xs truncate max-w-[120px]">{member.email}</span>
                                    ) : (
                                        <button
                                            onClick={() => setRevealedEmail(member.name)}
                                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                            title="Reveal Email"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </button>
                                    )}
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-muted-foreground text-xs mb-1">
                        © {new Date().getFullYear()} Attira. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Built with PyTorch, Hugging Face & Modal
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default MobileFooter;
