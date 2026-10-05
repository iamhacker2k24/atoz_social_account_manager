import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
  Wand2Icon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  // Temporary user data
  // Replace this with your actual auth/user data later
  const { logout, user } = {
    logout: () => {
      window.location.href = "/";
    },
    user: {
      name: "Jhon",
      email: "johndoe@example.com",
    },
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboardIcon,
      path: "/dashboard",
    },
    {
      name: "Accounts",
      icon: UsersIcon,
      path: "/accounts",
    },
    {
      name: "Schedule",
      icon: CalendarDaysIcon,
      path: "/schedule",
    },
    {
      name: "AI Composer",
      icon: Wand2Icon,
      path: "/ai-composer",
    },
  ];

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50
        w-64
        bg-white
        border-r border-slate-200
        flex flex-col
        h-screen
        transform
        transition-transform duration-300 ease-in-out
        md:relative
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="size-7 object-contain" />

          <span className="text-lg font-semibold tracking-tight text-slate-800">
            Scheduler
          </span>
        </div>
      </div>

      {/* Navigation Section Label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Menu
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-all duration-150
                border
                ${
                  isActive
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`
                      size-5 shrink-0
                      ${isActive ? "text-red-600" : "text-slate-400"}
                    `}
                  />

                  <span>{item.name}</span>

                  {isActive && (
                    <span className="ml-auto w-1 h-5 rounded-full bg-red-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
          {/* Avatar */}
          <div className="flex items-center justify-center size-10 rounded-full bg-red-100 text-red-600 font-semibold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Information */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="
              flex items-center justify-center
              size-8
              rounded-lg
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              transition-colors
            "
            title="Logout"
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
