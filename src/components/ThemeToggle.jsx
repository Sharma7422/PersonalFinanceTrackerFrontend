import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: 10 }}
      className={`rounded-full p-2 transition-colors duration-300 shadow-md border-2
        ${isDark ? "bg-indigo-700 border-indigo-400 text-yellow-200" : "bg-white border-indigo-300 text-indigo-700"}
        hover:bg-indigo-100 dark:hover:bg-indigo-800
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


// import { useEffect } from "react";

// export default function ThemeToggle() {
//   const setTheme = (theme) => {
//     document.documentElement.classList.remove("light", "dark");
//     if (theme === "auto") {
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       document.documentElement.classList.add(prefersDark ? "dark" : "light");
//       localStorage.setItem("theme", "auto");
//     } else {
//       document.documentElement.classList.add(theme);
//       localStorage.setItem("theme", theme);
//     }
//   };
//   useEffect(() => {
//     const saved = localStorage.getItem("theme");
//     if (saved) setTheme(saved);
//     else setTheme("auto");
//   }, []);
//   return (
//     <div className="flex gap-2">
//       <button onClick={() => setTheme("light")}>🌞</button>
//       <button onClick={() => setTheme("dark")}>🌙</button>
//       <button onClick={() => setTheme("auto")}>🖥️</button>
//     </div>
//   );
// }