import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, MenuIcon, XIcon, SparklesIcon } from "lucide-react";

export default function Navbar() {
  const { user } = { user: false };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group"
        >
          <img src="/logo.svg" alt="logo" className="size-8 transition-transform group-hover:scale-105" />
          <span className="text-xl sm:text-2xl font-semibold font-serif tracking-tight text-slate-900">
            Scheduler<span className="text-emerald-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#features"
            className="hover:text-emerald-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 hover:after:w-full after:transition-all"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-emerald-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 hover:after:w-full after:transition-all"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="hover:text-emerald-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 hover:after:w-full after:transition-all"
          >
            Pricing
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-emerald-200 hover:shadow-md transition-all active:scale-[0.98]"
            >
              Go to Dashboard <ArrowRightIcon className="size-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-emerald-500/25 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 font-medium text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              Pricing
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <SparklesIcon className="size-4" />
                <span>Get Started Free</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
