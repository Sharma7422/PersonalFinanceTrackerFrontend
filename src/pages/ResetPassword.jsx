import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await api.resetPassword(email, code, newPassword);
      setMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl px-4 sm:px-10 py-10 sm:py-14"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8 sm:mb-10"
        >
          <ShieldCheck className="w-14 h-14 text-indigo-600 mb-3 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-2 tracking-tight drop-shadow text-center">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg text-center font-medium">
            Enter the code sent to your email and set a new password.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email</label>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 text-lg rounded-xl shadow w-full"
              autoFocus
            />
          </div>
          <div className="relative">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Reset Code</label>
            <Input
              type="text"
              placeholder="Enter code from email"
              value={code}
              required
              onChange={(e) => setCode(e.target.value)}
              className="pl-12 py-3 text-lg rounded-xl shadow w-full"
            />
            <KeyRound className="absolute left-3 top-10 text-indigo-400" size={22} />
          </div>
          <div className="relative">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">New Password</label>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-12 py-3 text-lg rounded-xl shadow w-full"
            />
            <Lock className="absolute left-3 top-10 text-indigo-400" size={22} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 rounded-2xl shadow-xl text-lg transition-all duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        {msg && (
          <div className="mt-8 text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded-lg text-center font-semibold">
            {msg}
          </div>
        )}
        {error && (
          <div className="mt-8 text-red-700 bg-red-100 border border-red-300 px-4 py-3 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}