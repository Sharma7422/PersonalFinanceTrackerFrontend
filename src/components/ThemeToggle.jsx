import { useThemeContext } from "./ThemeContext";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: 10 }}
      className={`rounded-full p-2 transition-colors duration-300 shadow-md border-2
        ${isDark
          ? "bg-gray-800 border-blue-400 text-yellow-200"
          : "bg-white border-blue-300 text-blue-700"}
        hover:bg-blue-100 dark:hover:bg-gray-700
        ${className}
      `}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{ fontSize: 22 }}
    >
      {isDark ? <Sun /> : <Moon />}
    </motion.button>
  );
}