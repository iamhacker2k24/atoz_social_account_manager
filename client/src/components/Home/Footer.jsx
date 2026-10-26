import { Link } from "react-router-dom";
import { ArrowUpIcon } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Platform: [
    { label: "Twitter / X Sync", href: "#" },
    { label: "LinkedIn Integration", href: "#" },
    { label: "Instagram Publisher", href: "#" },
    { label: "Facebook Pages", href: "#" },
  ],
  Resources: [
    { label: "AI Copywriter", href: "#" },
    { label: "Social Strategy Guide", href: "#" },
    { label: "Help Documentation", href: "#" },
    { label: "API Reference", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link
              to="/"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <img src="/logo.svg" alt="logo" className="size-7 transition-transform group-hover:scale-105" />
              <span className="font-semibold font-serif text-2xl text-white tracking-tight">
                Scheduler<span className="text-emerald-400">.</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              The AI-driven multi-platform social media scheduler built for modern creators, agencies, and high-growth businesses.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full w-fit">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
                {category}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Scheduler Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Platform Features
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Back to top"
            >
              <span>Back to top</span>
              <ArrowUpIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
