import { motion } from "framer-motion";

export default function SidebarBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      className="flex items-center gap-3 mb-10 select-none"
    >
      <motion.div
        initial={{ rotate: -10, scale: 0.85 }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.13, 1, 1] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        className="bg-gradient-to-tr from-primary via-blue-400 to-rose-400 p-2 rounded-2xl shadow-xl"
        style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" fill="url(#grad1)" />
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <text x="8" y="22" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="Poppins, Arial, sans-serif">₹</text>
        </svg>
      </motion.div>
      <motion.span
        initial={{ letterSpacing: "-0.04em", opacity: 0.85 }}
        animate={{
          letterSpacing: ["-0.04em", "0.12em", "-0.04em"],
          opacity: [0.85, 1, 0.85],
          color: ["#fff", "#f43f5e", "#fff"],
          filter: [
            "drop-shadow(0 2px 8px #2563eb55)",
            "drop-shadow(0 2px 12px #f43f5e55)",
            "drop-shadow(0 2px 8px #2563eb55)"
          ]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="text-2xl font-extrabold bg-gradient-to-r from-primary via-blue-400 to-rose-400 bg-clip-text text-transparent tracking-wide"
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          textShadow: "0 2px 12px #0005, 0 1px 0 #fff3",
          padding: "0 0.25em"
        }}
      >
        Finance Tracker
      </motion.span>
    </motion.div>
  );
}