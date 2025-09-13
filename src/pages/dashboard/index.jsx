import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import AchievementConfetti from "@/components/AchievementConfetti";
import api from "../../api/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FinancialRecordForm from "./financial-record-form";
import FinancialRecordList from "./financial-record-list";
import { FaMoneyBillWave, FaCalendarCheck, FaPlus, FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

export default function DashboardHome() {
  const { user } = useOutletContext();
  const [dashboard, setDashboard] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Fetch dashboard overview data
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardOverview();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dashboard && dashboard.netBalance > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [dashboard]);

  if (loading) return <p className="text-center">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!dashboard) return null;

  const displayInsights =
    dashboard.insights && dashboard.insights.length > 0
      ? dashboard.insights.map((i) => i.text)
      : ["No insights yet. Add some records!"];

  const upcoming = dashboard.upcoming || { bills: [] };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i }
    }),
  };

  return (
    <>
      <AchievementConfetti show={showConfetti} />

      {/* Top bar with Financial Calendar and Add Record buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 md:mb-0">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center px-4 py-2 sm:px-5 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            onClick={() => navigate("/calendar")}
          >
            <FaCalendarCheck className="mr-2" /> Financial Calendar
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center px-4 py-2 sm:px-5 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
                <FaPlus className="mr-2" /> Add New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Add Financial Record
                </DialogTitle>
              </DialogHeader>
              <FinancialRecordForm
                onSubmitComplete={() => {
                  setOpen(false);
                  fetchData();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Expenses */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center border-l-4 border-rose-500 min-w-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <FaArrowDown className="text-rose-500 text-xl sm:text-2xl" />
            <span className="font-bold text-base sm:text-lg">Expenses</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-500 break-words">
            ₹{dashboard.totalExpenses?.toLocaleString() ?? 0}
          </p>
        </motion.div>
        {/* Incomes */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center border-l-4 border-green-500 min-w-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <FaArrowUp className="text-green-500 text-xl sm:text-2xl" />
            <span className="font-bold text-base sm:text-lg">Incomes</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-green-500 break-words">
            ₹{dashboard.totalIncome?.toLocaleString() ?? 0}
          </p>
        </motion.div>
        {/* Net Balance */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center border-l-4 border-indigo-500 min-w-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <FaWallet className="text-indigo-500 text-xl sm:text-2xl" />
            <span className="font-bold text-base sm:text-lg">Net Balance</span>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${dashboard.netBalance >= 0 ? "text-emerald-600" : "text-rose-600"} break-words`}>
            ₹{dashboard.netBalance?.toLocaleString() ?? 0}
          </p>
        </motion.div>
        {/* Upcoming Bills */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow flex flex-col border-l-4 border-yellow-500 min-w-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-yellow-500 text-xl sm:text-2xl" />
            <span className="font-bold text-base sm:text-lg">Upcoming Bills</span>
          </div>
          <ul className="flex-1 space-y-2 w-full">
            {(!upcoming.bills || upcoming.bills.length === 0) && (
              <li className="text-gray-400 text-sm">No upcoming bills</li>
            )}
            {upcoming.bills && upcoming.bills.map(b => (
              <li key={b._id} className="flex justify-between items-center">
                <span>{b.name}</span>
                <span className="text-xs text-gray-500">{b.dueDate}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Insights Widget */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
        style={{
          background: "linear-gradient(90deg, #6366f1 0%, #a21caf 100%)",
          color: "#fff"
        }}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">AI-Powered Insights ✨</h2>
        <ul className="space-y-2">
          {displayInsights.map((tip, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-white/20 p-3 rounded-lg"
            >
              {tip}
            </motion.li>
          ))}
        </ul>
        <div className="text-right mt-4">
          <Button
            variant="secondary"
            className="bg-white text-indigo-600 font-semibold hover:bg-gray-200 rounded-xl"
            onClick={() => navigate("/insights")}
          >
            View All Insights →
          </Button>
        </div>
      </motion.div>

      {/* Financial Records List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Financial Records</h2>
        <FinancialRecordList
          records={dashboard.recentRecords || []}
          onDataChanged={fetchData}
        />
      </motion.div>
    </>
  );
}

