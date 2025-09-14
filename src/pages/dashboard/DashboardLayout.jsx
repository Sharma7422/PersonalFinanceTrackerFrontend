import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, BarChart2, Settings, User, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/Notification";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user from localStorage
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/userImg/";
  

  let user = { name: "User", avatar: "default-avatar.png" };
try {
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    let avatar = parsed.profile || "default-avatar.png";
    if (avatar && !avatar.startsWith("http")) {
      avatar = IMAGE_BASE + avatar;
    }
    user = {
      name: parsed.name || "User",
      avatar,
    };
  }
} catch (e) {}
  // Sidebar navigation items
  const navItems = [
    { to: "/", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
    { to: "/profile", icon: <User size={18} />, label: "Profile" },
    { to: "/transactions", icon: <User size={18} />, label: "Transactions" },
    { to: "/budgets", icon: <User size={18} />, label: "Budgets" },
    { to: "/insights", icon: <User size={18} />, label: "Insights" },
    { to: "/calendar", icon: <User size={18} />, label: "Calendar" },
  ];

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
    {/* Mobile/Tablet Topbar */}
    <header
  className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow z-40 fixed top-0 left-0 right-0"
  style={{ minHeight: 56, position: "fixed" }}
>
  <button
    className="p-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
    onClick={() => setSidebarOpen(true)}
    aria-label="Open sidebar"
  >
    <Menu size={28} />
  </button>
  <motion.h1
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="text-lg font-bold"
  >
    {`Welcome, ${user.name} 👋`}
  </motion.h1>
  <div className="flex items-center space-x-2 relative z-50">
    <NotificationBell />
    <ThemeToggle />
    <motion.img
      src={user.avatar}
      alt="avatar"
      className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-lg cursor-pointer"
      whileHover={{ scale: 1.08, rotate: 2 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={() => navigate("/profile")}
    />
  </div>
</header>

    {/* Sidebar for desktop/tablet and slide-in for mobile */}
    <AnimatePresence>
      {(sidebarOpen || window.innerWidth >= 768) && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-indigo-600 to-blue-500 dark:from-gray-900 dark:to-gray-800 text-white p-6 shadow-2xl w-64
            ${sidebarOpen ? "block md:hidden" : "hidden md:block"}
          `}
          style={{ minWidth: 256, maxWidth: 320 }}
        >
          {/* Close button for mobile */}
          <div className="flex md:hidden justify-end mb-4">
            <button
              className="p-2 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-10">Finance Tracker</h2>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${
                    isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon} <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="flex items-center space-x-2 p-2 rounded-lg 
                bg-red-500 hover:bg-red-600 
                text-white w-full transition mt-10"
            >
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>

    {/* Desktop/Tablet Topbar */}
    <header
      className="hidden md:flex fixed top-0 left-0 md:left-64 right-0 h-16 flex justify-between items-center px-6 py-4 
      bg-white dark:bg-gray-800 shadow transition-colors duration-300 z-20"
      style={{ minHeight: 64 }}
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-bold"
      >
        {`Welcome, ${user.name} 👋`}
      </motion.h1>
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <ThemeToggle />
        <motion.img
          src={user.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-lg cursor-pointer"
          whileHover={{ scale: 1.08, rotate: 2 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>

    {/* Main Content */}
    <main
      className="flex-1 p-4 md:p-6 transition-colors duration-300 md:ml-64 mt-16"
      style={{ minHeight: "calc(100vh - 64px)", overflowY: "auto" }}
    >
      <Outlet context={{ user }} />
    </main>
  </div>
);
}

