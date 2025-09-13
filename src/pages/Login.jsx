import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";
import api from "../api/api";

const FINANCE_BG =
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500 overflow-hidden px-2 sm:px-4">
      {/* Blurred finance background image */}
      <img
        src={FINANCE_BG}
        alt="Finance background"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60 blur-[4px] z-0"
        style={{ filter: "blur(6px) brightness(0.7)" }}
        draggable={false}
      />
      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/60 via-white/40 to-pink-100/60 dark:from-gray-900/80 dark:via-gray-800/70 dark:to-indigo-900/80 z-0" />
      {/* Animated floating gradient blob */}
      <motion.div
        className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-400 opacity-25 rounded-full blur-3xl z-0"
        initial={{ scale: 0.7, x: 200, y: 100 }}
        animate={{ scale: 1.1, x: 0, y: 0 }}
        transition={{ duration: 1.2, type: "spring" }}
        style={{ bottom: "-10%", right: "-10%" }}
      />
      {/* Glassy Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="relative z-10 w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl px-4 sm:px-10 py-10 sm:py-14"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8 sm:mb-10"
        >
          <LogIn className="w-14 h-14 text-indigo-600 mb-3 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-2 tracking-tight drop-shadow text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg text-center font-medium">
            Login to your finance dashboard
          </p>
        </motion.div>
        <form onSubmit={handleLogin} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email</label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
              autoFocus
            />
            <Mail className="absolute left-3 top-10 text-indigo-400" size={22} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
            className="relative"
          >
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Password</label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
            />
            <Lock className="absolute left-3 top-10 text-indigo-400" size={22} />
            {/* Forgot password link */}
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline font-semibold transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="text-red-600 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center font-semibold"
            >
              {error}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex flex-col items-center"
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 rounded-2xl shadow-xl text-base sm:text-lg transition-all duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <span className="mt-5 text-gray-500 dark:text-gray-300 text-base">
              New here?{" "}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Register
              </Link>
            </span>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}