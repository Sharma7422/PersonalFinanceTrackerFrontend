import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Lock, Mail } from "lucide-react";
import api from "../api/api"; // <-- Import your API

const FINANCE_BG =
  "https://media.licdn.com/dms/image/v2/D5612AQGplp7JKG6Iiw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1673950361361?e=2147483647&v=beta&t=L4d5P81GijVgU4u1yJtFLVsIqATkfWTrymEPSd_C6_o";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setErrorMsg("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccessMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
        err.message ||
        "Registration failed. Try again."
      );
    }
    setLoading(false);
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500 overflow-hidden px-2 sm:px-4">
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
      className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-indigo-400 via-pink-400 to-blue-400 opacity-30 rounded-full blur-3xl z-0"
      initial={{ scale: 0.7, x: -120, y: -80 }}
      animate={{ scale: 1.1, x: 0, y: 0 }}
      transition={{ duration: 1.2, type: "spring" }}
      style={{ top: "-10%", left: "-10%" }}
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
        <UserPlus className="w-14 h-14 text-indigo-600 mb-3 drop-shadow-lg" />
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 mb-2 tracking-tight drop-shadow text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg text-center font-medium">
          Start your personal finance journey with style!
        </p>
      </motion.div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Full Name</label>
          <Input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
            autoFocus
          />
          <UserPlus className="absolute left-3 top-10 text-indigo-400" size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
          className="relative"
        >
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
            className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
          />
          <Mail className="absolute left-3 top-10 text-indigo-400" size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.21 }}
          className="relative"
        >
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Password</label>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
          />
          <Lock className="absolute left-3 top-10 text-indigo-400" size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24 }}
          className="relative"
        >
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Confirm Password</label>
          <Input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            className="pl-12 py-3 text-base sm:text-lg rounded-xl shadow w-full"
          />
          <Lock className="absolute left-3 top-10 text-indigo-400" size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="flex flex-col items-center"
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 rounded-2xl shadow-xl text-base sm:text-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <span className="mt-5 text-gray-500 dark:text-gray-300 text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </span>
        </motion.div>
      </form>
      {/* Success/Error Messages */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed top-6 right-4 sm:right-8 z-50 bg-green-100 border border-green-300 text-green-700 px-6 py-3 rounded-lg shadow-lg font-semibold"
          style={{ minWidth: 180, maxWidth: 360, width: "auto" }}
        >
          {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed top-20 right-4 sm:right-8 z-50 bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg shadow-lg font-semibold"
          style={{ minWidth: 180, maxWidth: 360, width: "auto" }}
        >
          {errorMsg}
        </motion.div>
      )}
    </motion.div>
  </div>
);
}


