import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Dot,
} from "recharts";
import { Button } from "@/components/ui/button";
import { FaArrowUp, FaArrowDown, FaWallet, FaChartPie, FaChartLine, FaMagic, FaRupeeSign } from "react-icons/fa";
import api from "../api/api";

const COLORS = ["#22c55e", "#2563eb", "#f59e0b", "#ef4444", "#a21caf", "#0ea5e9", "#f43f5e"];

const INSIGHT_ICONS = {
  suggestion: "💡",
  alert: "⚠️",
  trend: "📈",
  budgets: "📊",
  transactions: "💸",
  savings: "💰",
  anomaly: "🚨",
};
const INSIGHT_COLORS = {
  suggestion: "bg-blue-50 dark:bg-blue-900",
  alert: "bg-yellow-50 dark:bg-yellow-900",
  trend: "bg-green-50 dark:bg-green-900",
  budgets: "bg-indigo-50 dark:bg-indigo-900",
  transactions: "bg-rose-50 dark:bg-rose-900",
  savings: "bg-emerald-50 dark:bg-emerald-900",
  anomaly: "bg-red-50 dark:bg-red-900",
};

const kpiCards = [
  {
    label: "Total Income",
    icon: <FaArrowUp className="text-emerald-400 text-3xl" />,
    gradient: "from-emerald-400/80 to-emerald-600/80",
    key: "totalIncome",
    text: "text-emerald-100",
    bg: "bg-emerald-500/70",
  },
  {
    label: "Total Expenses",
    icon: <FaArrowDown className="text-rose-400 text-3xl" />,
    gradient: "from-rose-400/80 to-rose-600/80",
    key: "totalExpenses",
    text: "text-rose-100",
    bg: "bg-rose-500/70",
  },
  {
    label: "Net Savings",
    icon: <FaWallet className="text-indigo-300 text-3xl" />,
    gradient: "from-indigo-400/80 to-indigo-600/80",
    key: "netSavings",
    text: "text-indigo-100",
    bg: "bg-indigo-500/70",
  },
];

export default function InsightsPage() {
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ totalIncome: 0, totalExpenses: 0, netSavings: 0 });
  const [pieData, setPieData] = useState([]);
  const [lineChart, setLineChart] = useState([]);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [drilldown, setDrilldown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getInsightsOverview(period)
      .then(data => {
        setKpis(data.kpis || { totalIncome: 0, totalExpenses: 0, netSavings: 0 });
        setPieData(data.pieData || []);
        setLineChart(data.lineChart || []);
        setInsights(data.insights || []);
        setPredictions(data.predictions || []);
        setTrends(data.trends || []);
      })
      .finally(() => setLoading(false));
  }, [period]);

  const handleInsightClick = (type) => {
    if (type === "budgets") {
      navigate("/budgets");
    } else if (type === "transactions") {
      navigate("/transactions");
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 text-primary dark:text-blue-300">
          <FaMagic className="text-indigo-500 animate-pulse" /> Insights & Reports
        </h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }}>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

{/* Top KPI Cards */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }}
>
  {kpiCards.map((card, idx) => (
    <motion.div
      key={card.key}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: idx * 0.1, type: "spring", stiffness: 120 }}
    >
      <div
        className={`
          relative rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-start justify-between min-h-[140px]
          bg-gradient-to-br
          ${
            card.key === "totalIncome"
              ? "from-primary/90 via-blue-400/80 to-emerald-400/80"
              : card.key === "totalExpenses"
              ? "from-primary/90 via-blue-400/80 to-rose-400/80"
              : "from-primary/90 via-blue-400/80 to-indigo-400/80"
          }
          backdrop-blur-xl border border-white/20
          hover:scale-[1.04] hover:shadow-2xl
          hover:ring-2 hover:ring-blue-400/40
          transition-all duration-200
          group
        `}
        style={{
          boxShadow: "0 4px 32px 0 rgba(36, 63, 156, 0.10)",
        }}
      >
        <div className="absolute top-4 right-4 opacity-30 text-5xl pointer-events-none">
          {card.icon}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{card.icon}</span>
          <span className="font-bold text-lg tracking-wide text-white drop-shadow">
            {card.label}
          </span>
        </div>
        <div
  className={`
    text-4xl font-extrabold flex items-center gap-2
    text-white group-hover:${
      card.key === "totalIncome"
        ? "text-emerald-200"
        : card.key === "totalExpenses"
        ? "text-rose-200"
        : "text-indigo-200"
    }
    drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]
    transition-colors duration-200
  `}
  style={{
    textShadow: "0 2px 12px rgba(0,0,0,0.35), 0 1px 0 #fff3",
    letterSpacing: "0.01em",
  }}
>
  <FaRupeeSign className="inline-block" />
  {kpis[card.key]?.toLocaleString?.() ?? 0}
</div>
      </div>
    </motion.div>
  ))}
</motion.div>

      {/* Trends & Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Trends */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/80 dark:to-green-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-200">
                <FaChartLine className="animate-bounce" /> Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {trends.length === 0 && (
                  <li className="text-gray-400">No trend data</li>
                )}
                {trends.map(t => (
                  <li key={t.category} className="flex justify-between items-center mb-2">
                    <span>{t.category}</span>
                    <span className={
                      t.direction === "up"
                        ? "text-rose-500 font-bold"
                        : t.direction === "down"
                        ? "text-green-600 font-bold"
                        : "text-gray-500"
                    }>
                      {t.change} {t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-indigo-50/80 to-indigo-100/80 dark:from-indigo-900/80 dark:to-indigo-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-200">
                <FaMagic className="animate-spin" /> Next Month Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {predictions.length === 0 && (
                  <li className="text-gray-400">No prediction data</li>
                )}
                {predictions.map(p => (
                  <li key={p.category} className="flex justify-between items-center mb-2">
                    <span>{p.category}</span>
                    <span className="text-indigo-600 font-semibold">₹{p.nextMonth}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary dark:text-blue-300">
                <FaChartPie className="text-indigo-400" /> Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive
                    onClick={(_, idx) => setDrilldown(pieData[idx])}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-400 mt-2">Click a segment for details</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary dark:text-blue-300">
                <FaChartLine className="text-emerald-400" /> Cash Flow Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChart}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 12px 0 rgba(99,102,241,0.10)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={<Dot r={6} fill="#22c55e" stroke="#fff" strokeWidth={2} />}
                    activeDot={{ r: 10 }}
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={<Dot r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />}
                    activeDot={{ r: 10 }}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Drilldown Drawer for Pie Chart */}
      <Drawer open={!!drilldown} onOpenChange={() => setDrilldown(null)}>
        <DrawerContent className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-t-2xl max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle>
              {drilldown?.name} Details
            </DrawerTitle>
          </DrawerHeader>
          <div>
            <div className="mb-2">Total: <b>₹{drilldown?.value}</b></div>
            {/* Optionally, you can list transactions for this category here */}
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setDrilldown(null)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* AI Insights Feed */}
      <Card className="shadow-lg rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary dark:text-blue-300">
            <FaMagic className="text-indigo-400 animate-pulse" /> AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.length === 0 && (
              <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                No insights for this period.
              </li>
            )}
            <AnimatePresence>
              {insights.map((insight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: idx * 0.07 }}
                  whileHover={{ scale: 1.04, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleInsightClick(insight.type)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 transition
                    ${INSIGHT_COLORS[insight.type] || "bg-gray-100 dark:bg-gray-800"}
                    hover:shadow-md`}
                >
                  <span className="text-xl animate-bounce">{INSIGHT_ICONS[insight.type] || "💡"}</span>
                  <span>{insight.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}