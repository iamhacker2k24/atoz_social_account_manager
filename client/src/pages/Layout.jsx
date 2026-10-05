import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/schedule": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const title = pageTitles[location.pathname] || "Social Website";

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Section */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 md:px-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page Heading */}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
              {title}
            </h1>

            <p className="hidden text-xs text-slate-400 sm:block sm:text-sm">
              Manage and automate your social presence
            </p>
          </div>

          {/* Right Side Header Area */}
          <div className="ml-auto flex items-center gap-2">
            {/* Add profile/notification buttons here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 md:p-8 xl:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
