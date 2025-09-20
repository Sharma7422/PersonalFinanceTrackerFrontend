import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Settings,
  User,
  LogOut,
  Menu,
  Calendar,
  BookOpen,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/Notification";
import SidebarBrand from "@/components/SidebarBrand"; // Uncomment if you want to use the reusable component

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive sidebar logic
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get user from localStorage
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/userImg/";
  let user = { name: "User", avatar: "/default-avatar.png" };
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      let avatar = parsed.profile || "/default-avatar.png";
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
    { to: "/transactions", icon: <List size={18} />, label: "Transactions" },
    { to: "/budgets", icon: <BookOpen size={18} />, label: "Budgets" },
    { to: "/insights", icon: <BarChart2 size={18} />, label: "Insights" },
    { to: "/calendar", icon: <Calendar size={18} />, label: "Calendar" },
  ];

  return (
    <div className="min-h-screen bg-background text-text dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      {/* --- Topbar (Mobile/Tablet) --- */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow z-40 fixed top-0 left-0 right-0"
        style={{ minHeight: 56, position: "fixed" }}
      >
        <button
          className="p-2 rounded-md hover:bg-primary/10 dark:hover:bg-gray-700 transition"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={28} />
        </button>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold text-primary dark:text-blue-300"
        >
          <motion.span
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">
              Welcome,
            </span>
            <motion.span
              initial={{ letterSpacing: "-0.04em", opacity: 0.85 }}
              animate={{
                letterSpacing: ["-0.04em", "0.12em", "-0.04em"],
                opacity: [0.85, 1, 0.85],
                filter: [
                  "drop-shadow(0 2px 8px #2563eb55)",
                  "drop-shadow(0 2px 12px #f43f5e55)",
                  "drop-shadow(0 2px 8px #2563eb55)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-lg font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent"
              style={{
                fontFamily: "Poppins, Arial, sans-serif",
                textShadow: "0 2px 12px #0005, 0 1px 0 #fff3",
                padding: "0 0.15em",
              }}
            >
              {user.name}
            </motion.span>
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="origin-bottom-left"
              style={{ display: "inline-block" }}
            >
              👋
            </motion.span>
          </motion.span>
        </motion.h1>
        <div className="flex items-center space-x-2 relative z-50">
          <NotificationBell />
          <ThemeToggle />
          <motion.img
            src={user.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-primary shadow-lg cursor-pointer"
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate("/profile")}
          />
        </div>
      </header>

      {/* --- Sidebar (Desktop/Tablet & Slide-in Mobile) --- */}
      <AnimatePresence>
        {(sidebarOpen || isDesktop) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-primary to-blue-400 dark:from-gray-900 dark:to-gray-800 text-white p-6 shadow-2xl w-64
              ${sidebarOpen ? "block md:hidden" : "hidden md:block"}
            `}
            style={{ minWidth: 256, maxWidth: 320 }}
          >
            {/* Close button for mobile */}
            <div className="flex md:hidden justify-end mb-4">
              <button
                className="p-2 rounded-md hover:bg-primary/10 dark:hover:bg-gray-700 transition"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* --- Sidebar Brand/Logo --- */}
            {/* <SidebarBrand /> */}
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 14 }}
              className="flex items-center gap-3 mb-10 select-none"
            >
              {/* Animated logo */}
              <motion.div
                initial={{ rotate: -10, scale: 0.85 }}
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.13, 1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.2,
                  ease: "easeInOut",
                }}
                className="bg-gradient-to-tr from-primary via-blue-400 to-rose-400 p-2 rounded-2xl shadow-xl"
                style={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="url(#grad1)" />
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0"
                      y1="0"
                      x2="32"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#2563eb" />
                      <stop offset="1" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                  <text
                    x="8"
                    y="22"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#fff"
                    fontFamily="Poppins, Arial, sans-serif"
                  >
                    ₹
                  </text>
                </svg>
              </motion.div>
              {/* Animated gradient text */}
              <motion.span
                initial={{ letterSpacing: "-0.04em", opacity: 0.85 }}
                animate={{
                  letterSpacing: ["-0.04em", "0.12em", "-0.04em"],
                  opacity: [0.85, 1, 0.85],
                  color: ["#fff", "#f43f5e", "#fff"],
                  filter: [
                    "drop-shadow(0 2px 8px #2563eb55)",
                    "drop-shadow(0 2px 12px #f43f5e55)",
                    "drop-shadow(0 2px 8px #2563eb55)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="text-2xl font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent tracking-wide"
                style={{
                  fontFamily: "Poppins, Arial, sans-serif",
                  textShadow: "0 2px 12px #0005, 0 1px 0 #fff3",
                  padding: "0 0.25em",
                }}
              >
                Finance Tracker
              </motion.span>
            </motion.div>
            {/* --- Sidebar Navigation --- */}
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${
                      isActive
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon} <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            {/* --- Sidebar Logout Button --- */}
            <div className="mt-auto">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="group flex items-center justify-center gap-2 w-full mt-10 py-2 px-3 rounded-xl
                  bg-gradient-to-r from-primary via-blue-600 to-rose-500
                  hover:from-blue-700 hover:via-red-500 hover:to-red-600
                  text-white font-bold shadow-lg ring-1 ring-primary/30 dark:ring-blue-900/40
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                style={{ fontSize: "1rem", letterSpacing: "0.01em" }}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition">
                  <LogOut size={18} className="text-white drop-shadow" />
                </span>
                <span className="tracking-wide">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- Topbar (Desktop/Tablet) --- */}
      <header
        className="hidden md:flex fixed top-0 left-0 md:left-64 right-0 h-16 flex justify-between items-center px-6 py-4 
        bg-white dark:bg-gray-800 shadow transition-colors duration-300 z-20"
        style={{ minHeight: 64 }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-primary dark:text-blue-300"
        >
          <motion.span
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">
              Welcome,
            </span>
            <span className="text-xl font-bold text-primary dark:text-blue-200 drop-shadow-sm">
              {user.name}
            </span>
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="origin-bottom-left"
              style={{ display: "inline-block" }}
            >
              👋
            </motion.span>
          </motion.span>
        </motion.h1>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <ThemeToggle />
          <motion.img
            src={user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-primary shadow-lg cursor-pointer"
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate("/profile")}
          />
        </div>
      </header>

      {/* --- Main Content --- */}
      <main
        className="flex-1 p-4 md:p-6 transition-colors duration-300 md:ml-64 mt-16"
        style={{ minHeight: "calc(100vh - 64px)", overflowY: "auto" }}
      >
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

// import { useState } from "react";
// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import { Home, BarChart2, Settings, User, LogOut, Menu, Calendar, BookOpen, List } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import ThemeToggle from "@/components/ThemeToggle";
// import NotificationBell from "@/components/Notification";

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Get user from localStorage
//   const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/userImg/";

//   let user = { name: "User", avatar: "/default-avatar.png" };
//   try {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       let avatar = parsed.avatar || "/default-avatar.png";
//       if (avatar && !avatar.startsWith("http")) {
//         avatar = IMAGE_BASE + avatar;
//       }
//       user = {
//         name: parsed.name || "User",
//         avatar,
//       };
//     }
//   } catch (e) {}

//   // Sidebar navigation items
//   const navItems = [
//     { to: "/", icon: <Home size={18} />, label: "Dashboard" },
//     { to: "/analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
//     { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
//     { to: "/profile", icon: <User size={18} />, label: "Profile" },
//     { to: "/transactions", icon: <List size={18} />, label: "Transactions" },
//     { to: "/budgets", icon: <BookOpen size={18} />, label: "Budgets" },
//     { to: "/insights", icon: <BarChart2 size={18} />, label: "Insights" },
//     { to: "/calendar", icon: <Calendar size={18} />, label: "Calendar" },
//   ];

//   return (
//     <div className="min-h-screen bg-background text-text dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
//       {/* Mobile/Tablet Topbar */}
//       <header
//         className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow z-40 fixed top-0 left-0 right-0"
//         style={{ minHeight: 56, position: "fixed" }}
//       >
//         <button
//           className="p-2 rounded-md hover:bg-primary/10 dark:hover:bg-gray-700 transition"
//           onClick={() => setSidebarOpen(true)}
//           aria-label="Open sidebar"
//         >
//           <Menu size={28} />
//         </button>
//         <motion.h1
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-lg font-bold text-primary dark:text-blue-300"
//         >
//           {`Welcome, ${user.name} 👋`}
//         </motion.h1>
//         <div className="flex items-center space-x-2 relative z-50">
//           <NotificationBell />
//           <ThemeToggle />
//           <motion.img
//             src={user.avatar}
//             alt="avatar"
//             className="w-9 h-9 rounded-full border-2 border-primary shadow-lg cursor-pointer"
//             whileHover={{ scale: 1.08, rotate: 2 }}
//             transition={{ type: "spring", stiffness: 200 }}
//             onClick={() => navigate("/profile")}
//           />
//         </div>
//       </header>

//       {/* Sidebar for desktop/tablet and slide-in for mobile */}
//       <AnimatePresence>
//         {(sidebarOpen || window.innerWidth >= 768) && (
//           <motion.aside
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: -300 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-primary to-blue-400 dark:from-gray-900 dark:to-gray-800 text-white p-6 shadow-2xl w-64
//               ${sidebarOpen ? "block md:hidden" : "hidden md:block"}
//             `}
//             style={{ minWidth: 256, maxWidth: 320 }}
//           >
//             {/* Close button for mobile */}
//             <div className="flex md:hidden justify-end mb-4">
//               <button
//                 className="p-2 rounded-md hover:bg-primary/10 dark:hover:bg-gray-700 transition"
//                 onClick={() => setSidebarOpen(false)}
//                 aria-label="Close sidebar"
//               >
//                 <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
//               </button>
//             </div>
// <motion.div
//   initial={{ opacity: 0, y: -18, scale: 0.92 }}
//   animate={{ opacity: 1, y: 0, scale: 1 }}
//   transition={{ type: "spring", stiffness: 140, damping: 14 }}
//   className="flex items-center gap-3 mb-10 select-none"
// >
//   {/* Animated logo */}
//   <motion.div
//     initial={{ rotate: -10, scale: 0.85 }}
//     animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.13, 1, 1] }}
//     transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
//     className="bg-gradient-to-tr from-primary via-blue-400 to-rose-400 p-2 rounded-2xl shadow-xl"
//     style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
//   >
//     <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
//       <circle cx="16" cy="16" r="15" fill="url(#grad1)" />
//       <defs>
//         <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
//           <stop stopColor="#2563eb" />
//           <stop offset="1" stopColor="#f43f5e" />
//         </linearGradient>
//       </defs>
//       <text x="8" y="22" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="Poppins, Arial, sans-serif">₹</text>
//     </svg>
//   </motion.div>
//   {/* Animated gradient text */}
//   <motion.span
//     initial={{ letterSpacing: "-0.04em", opacity: 0.85 }}
//     animate={{
//       letterSpacing: ["-0.04em", "0.12em", "-0.04em"],
//       opacity: [0.85, 1, 0.85],
//       color: ["#fff", "#f43f5e", "#fff"],
//       filter: [
//         "drop-shadow(0 2px 8px #2563eb55)",
//         "drop-shadow(0 2px 12px #f43f5e55)",
//         "drop-shadow(0 2px 8px #2563eb55)"
//       ]
//     }}
//     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//     className="text-2xl font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent tracking-wide"
//     style={{
//       fontFamily: "Poppins, Arial, sans-serif",
//       textShadow: "0 2px 12px #0005, 0 1px 0 #fff3",
//       padding: "0 0.25em"
//     }}
//   >
//     Finance Tracker
//   </motion.span>
// </motion.div>
//             <nav className="space-y-4">
//               {navItems.map((item) => (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   className={({ isActive }) =>
//                     `flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition ${
//                       isActive
//                         ? "bg-white/20 font-semibold"
//                         : "hover:bg-white/10"
//                     }`
//                   }
//                   onClick={() => setSidebarOpen(false)}
//                 >
//                   {item.icon} <span>{item.label}</span>
//                 </NavLink>
//               ))}
//             </nav>
//             <div className="mt-auto">
//   <button
//     onClick={() => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     }}
//     className="group flex items-center justify-center gap-2 w-full mt-10 py-2 px-3 rounded-xl
//       bg-gradient-to-r from-primary via-blue-600 to-rose-500
//       hover:from-blue-700 hover:via-red-500 hover:to-red-600
//       text-white font-bold shadow-lg ring-1 ring-primary/30 dark:ring-blue-900/40
//       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
//     style={{ fontSize: "1rem", letterSpacing: "0.01em" }}
//   >
//     <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition">
//       <LogOut size={18} className="text-white drop-shadow" />
//     </span>
//     <span className="tracking-wide">Logout</span>
//   </button>
// </div>
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* Desktop/Tablet Topbar */}
//       <header
//         className="hidden md:flex fixed top-0 left-0 md:left-64 right-0 h-16 flex justify-between items-center px-6 py-4
//         bg-white dark:bg-gray-800 shadow transition-colors duration-300 z-20"
//         style={{ minHeight: 64 }}
//       >
//         <motion.h1
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-xl font-bold text-primary dark:text-blue-300"
//         >
//           <motion.span
//   initial={{ opacity: 0, x: -18 }}
//   animate={{ opacity: 1, x: 0 }}
//   transition={{ type: "spring", stiffness: 120, damping: 16 }}
//   className="flex items-center gap-2"
// >
//   <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">
//     Welcome,
//   </span>
//   <span className="text-xl font-bold text-primary dark:text-blue-200 drop-shadow-sm">
//     {user.name}
//   </span>
//   <motion.span
//     initial={{ rotate: 0 }}
//     animate={{ rotate: [0, 20, -10, 0] }}
//     transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
//     className="origin-bottom-left"
//     style={{ display: "inline-block" }}
//   >
//     👋
//   </motion.span>
// </motion.span>
//         </motion.h1>
//         <div className="flex items-center space-x-4">
//           <NotificationBell />
//           <ThemeToggle />
//           <motion.img
//             src={user.avatar}
//             alt="avatar"
//             className="w-10 h-10 rounded-full border-2 border-primary shadow-lg cursor-pointer"
//             whileHover={{ scale: 1.08, rotate: 2 }}
//             transition={{ type: "spring", stiffness: 200 }}
//             onClick={() => navigate("/profile")}
//           />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main
//         className="flex-1 p-4 md:p-6 transition-colors duration-300 md:ml-64 mt-16"
//         style={{ minHeight: "calc(100vh - 64px)", overflowY: "auto" }}
//       >
//         <Outlet context={{ user }} />
//       </main>
//     </div>
//   );
// }
