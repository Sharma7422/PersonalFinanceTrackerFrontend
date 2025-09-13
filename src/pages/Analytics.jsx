import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../api/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ReloadIcon } from "@radix-ui/react-icons";

// Register Chart.js components ONCE
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Tooltip,
  Legend
);

const quickRanges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Year to date", value: "ytd" },
  { label: "All time", value: "all" },
  { label: "Custom…", value: "custom" },
];

function startOfDay(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getRange(quickRange, fromDate, toDate) {
  const today = startOfDay(new Date());
  if (quickRange === "custom" && fromDate && toDate) {
    return { from: startOfDay(new Date(fromDate)), to: startOfDay(new Date(toDate)) };
  }
  if (quickRange === "all") {
    return null; // let backend handle all time
  }
  if (quickRange === "ytd") {
    const yearStart = startOfDay(new Date(new Date().getFullYear(), 0, 1));
    return { from: yearStart, to: today };
  }
  const days = quickRange === "7d" ? 7 : quickRange === "90d" ? 90 : 30;
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400000));
  return { from, to: today };
}

export default function AnalyticsPage() {
  // Filters
  const [quickRange, setQuickRange] = useState("30d");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Data
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch analytics with filters
  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      // Prepare params for API
      let params = {};
      const range = getRange(quickRange, fromDate, toDate);
      if (range) {
        params.from = range.from.toISOString().slice(0, 10);
        params.to = range.to.toISOString().slice(0, 10);
      }
      const data = await getAnalyticsOverview(params);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line
  }, [quickRange, fromDate, toDate]);

  // Chart data (handle empty analytics)
  const kpis = analytics?.kpis || { total: 0, avgPerDay: 0, topCategory: "—", transactionCount: 0 };
  const lineData = {
    labels: analytics?.lineChart?.map((d) => d.date) || [],
    datasets: [
      {
        label: "Daily Spend",
        data: analytics?.lineChart?.map((d) => d.total) || [],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        fill: true,
        tension: 0.35,
      },
    ],
  };
  const donutData = {
    labels: analytics?.donutChart?.map((d) => d.category) || [],
    datasets: [
      {
        data: analytics?.donutChart?.map((d) => d.total) || [],
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#a855f7",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#8b5cf6",
          "#10b981",
        ],
        borderWidth: 0,
      },
    ],
  };
  const barData = {
    labels: analytics?.barChart?.map((d) => d.month) || [],
    datasets: [
      {
        label: "Monthly Total",
        data: analytics?.barChart?.map((d) => d.total) || [],
        backgroundColor: "rgba(99,102,241,0.6)",
      },
    ],
  };

  // Empty state check
  const isEmpty =
    (!analytics ||
      (!analytics.lineChart?.length &&
        !analytics.donutChart?.length &&
        !analytics.barChart?.length &&
        (!analytics.budgets || !analytics.budgets.length))) &&
    !loading &&
    !error;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Quick range */}
            <Select value={quickRange} onValueChange={setQuickRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }}>
                {quickRanges.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Custom date range */}
            {quickRange === "custom" && (
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate || undefined}
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || undefined}
                />
              </div>
            )}
            <Button
              variant="outline"
              onClick={fetchAnalytics}
              disabled={loading}
              className="gap-2"
              title="Refresh"
            >
              <ReloadIcon className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Handling */}
      {error && (
        <div className="flex flex-col items-center text-red-500 gap-2">
          <span>{error}</span>
          <Button onClick={fetchAnalytics} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="flex flex-col items-center text-muted-foreground py-12">
          <span className="text-2xl mb-2">No analytics data found.</span>
          <span>Add some financial records or budgets to see analytics here.</span>
        </div>
      )}

      {/* Main Analytics Content */}
      {!isEmpty && !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Spend", value: `₹${kpis.total.toLocaleString()}` },
              { label: "Avg / Day", value: `₹${kpis.avgPerDay.toLocaleString()}` },
              { label: "Top Category", value: kpis.topCategory },
              { label: "Transactions", value: kpis.transactionCount },
            ].map((kpi) => (
              <Card key={kpi.label} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">{kpi.label}</div>
                  <div className="text-2xl font-semibold mt-1">{kpi.value}</div>
                </CardContent>
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Spending Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {lineData.labels.length ? (
                  <Line data={lineData} options={{ responsive: true }} />
                ) : (
                  <div className="text-muted-foreground py-8 text-center">No data for selected range.</div>
                )}
              </CardContent>
            </Card>
            {/* Donut Chart */}
            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {donutData.labels.length ? (
                  <div className="w-full max-w-xs">
                    <Doughnut data={donutData} options={{ plugins: { legend: { position: "bottom" } } }} />
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">No category data.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Totals</CardTitle>
            </CardHeader>
            <CardContent>
              {barData.labels.length ? (
                <Bar data={barData} options={{ responsive: true }} />
              ) : (
                <div className="text-muted-foreground py-8 text-center">No monthly data.</div>
              )}
            </CardContent>
          </Card>

          {/* Budgets Section */}
          {analytics?.budgets && analytics.budgets.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Budgets (per category)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.budgets.map((b) => {
                    const spent =
                      analytics.donutChart.find((d) => d.category === b.category)?.total || 0;
                    const pct =
                      b.budget > 0 ? Math.min(100, Math.round((spent / b.budget) * 100)) : 0;
                    return (
                      <div key={b.category} className="rounded-xl border p-4 bg-background">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Category</div>
                            <div className="text-lg font-semibold">{b.category}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Budget</span>
                            <span className="font-semibold">₹{b.budget.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Spent: ₹{spent.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              {b.budget > 0 ? `${pct}% of ₹${b.budget.toLocaleString()}` : "No budget set"}
                            </span>
                          </div>
                          <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${
                                pct < 75
                                  ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                  : pct < 100
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                                  : "bg-gradient-to-r from-rose-500 to-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}





// import { useEffect, useState, useMemo } from "react";
// import { getAnalyticsOverview } from "../api/api";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Line, Bar, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   TimeScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import "chartjs-adapter-date-fns";
// import { ReloadIcon } from "@radix-ui/react-icons";

// // Register Chart.js components ONCE
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   TimeScale,
//   Tooltip,
//   Legend
// );

// const quickRanges = [
//   { label: "Last 7 days", value: "7d" },
//   { label: "Last 30 days", value: "30d" },
//   { label: "Last 90 days", value: "90d" },
//   { label: "Year to date", value: "ytd" },
//   { label: "All time", value: "all" },
//   { label: "Custom…", value: "custom" },
// ];

// function startOfDay(d) {
//   const date = new Date(d);
//   date.setHours(0, 0, 0, 0);
//   return date;
// }

// function getRange(quickRange, fromDate, toDate) {
//   const today = startOfDay(new Date());
//   if (quickRange === "custom" && fromDate && toDate) {
//     return { from: startOfDay(new Date(fromDate)), to: startOfDay(new Date(toDate)) };
//   }
//   if (quickRange === "all") {
//     return null; // let backend handle all time
//   }
//   if (quickRange === "ytd") {
//     const yearStart = startOfDay(new Date(new Date().getFullYear(), 0, 1));
//     return { from: yearStart, to: today };
//   }
//   const days = quickRange === "7d" ? 7 : quickRange === "90d" ? 90 : 30;
//   const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400000));
//   return { from, to: today };
// }

// export default function AnalyticsPage() {
//   // Filters
//   const [quickRange, setQuickRange] = useState("30d");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Data
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch analytics with filters
//   const fetchAnalytics = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Prepare params for API
//       let params = {};
//       const range = getRange(quickRange, fromDate, toDate);
//       if (range) {
//         params.from = range.from.toISOString().slice(0, 10);
//         params.to = range.to.toISOString().slice(0, 10);
//       }
//       // You may need to update your backend to accept from/to query params
//       const data = await getAnalyticsOverview(params);
//       setAnalytics(data);
//     } catch (err) {
//       setError(err.message || "Failed to load analytics.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//     // eslint-disable-next-line
//   }, [quickRange, fromDate, toDate]);

//   // Chart data (handle empty analytics)
//   const kpis = analytics?.kpis || { total: 0, avgPerDay: 0, topCategory: "—", transactionCount: 0 };
//   const lineData = {
//     labels: analytics?.lineChart?.map((d) => d.date) || [],
//     datasets: [
//       {
//         label: "Daily Spend",
//         data: analytics?.lineChart?.map((d) => d.total) || [],
//         borderColor: "#6366f1",
//         backgroundColor: "rgba(99,102,241,0.2)",
//         fill: true,
//         tension: 0.35,
//       },
//     ],
//   };
//   const donutData = {
//     labels: analytics?.donutChart?.map((d) => d.category) || [],
//     datasets: [
//       {
//         data: analytics?.donutChart?.map((d) => d.total) || [],
//         backgroundColor: [
//           "#22c55e",
//           "#3b82f6",
//           "#a855f7",
//           "#f59e0b",
//           "#ef4444",
//           "#06b6d4",
//           "#8b5cf6",
//           "#10b981",
//         ],
//         borderWidth: 0,
//       },
//     ],
//   };
//   const barData = {
//     labels: analytics?.barChart?.map((d) => d.month) || [],
//     datasets: [
//       {
//         label: "Monthly Total",
//         data: analytics?.barChart?.map((d) => d.total) || [],
//         backgroundColor: "rgba(99,102,241,0.6)",
//       },
//     ],
//   };

//   // Empty state check
//   const isEmpty =
//     (!analytics ||
//       (!analytics.lineChart?.length &&
//         !analytics.donutChart?.length &&
//         !analytics.barChart?.length &&
//         (!analytics.budgets || !analytics.budgets.length))) &&
//     !loading &&
//     !error;

//   return (
//     <div className="space-y-6">
//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Analytics Filters</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             {/* Quick range */}
//             <Select value={quickRange} onValueChange={setQuickRange}>
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Range" />
//               </SelectTrigger>
//               <SelectContent>
//                 {quickRanges.map((r) => (
//                   <SelectItem key={r.value} value={r.value}>
//                     {r.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {/* Custom date range */}
//             {quickRange === "custom" && (
//               <div className="flex gap-2">
//                 <Input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   max={toDate || undefined}
//                 />
//                 <Input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   min={fromDate || undefined}
//                 />
//               </div>
//             )}
//             <Button
//               variant="outline"
//               onClick={fetchAnalytics}
//               disabled={loading}
//               className="gap-2"
//               title="Refresh"
//             >
//               <ReloadIcon className={loading ? "animate-spin" : ""} />
//               Refresh
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Error Handling */}
//       {error && (
//         <div className="flex flex-col items-center text-red-500 gap-2">
//           <span>{error}</span>
//           <Button onClick={fetchAnalytics} variant="outline">
//             Retry
//           </Button>
//         </div>
//       )}

//       {/* Empty State */}
//       {isEmpty && (
//         <div className="flex flex-col items-center text-muted-foreground py-12">
//           <span className="text-2xl mb-2">No analytics data found.</span>
//           <span>Add some financial records or budgets to see analytics here.</span>
//         </div>
//       )}

//       {/* Main Analytics Content */}
//       {!isEmpty && !error && (
//         <>
//           {/* KPI Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[
//               { label: "Total Spend", value: `₹${kpis.total.toLocaleString()}` },
//               { label: "Avg / Day", value: `₹${kpis.avgPerDay.toLocaleString()}` },
//               { label: "Top Category", value: kpis.topCategory },
//               { label: "Transactions", value: kpis.transactionCount },
//             ].map((kpi) => (
//               <Card key={kpi.label} className="overflow-hidden">
//                 <CardContent className="p-4">
//                   <div className="text-sm text-muted-foreground">{kpi.label}</div>
//                   <div className="text-2xl font-semibold mt-1">{kpi.value}</div>
//                 </CardContent>
//                 <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
//               </Card>
//             ))}
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Line Chart */}
//             <Card className="lg:col-span-2">
//               <CardHeader>
//                 <CardTitle>Spending Over Time</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {lineData.labels.length ? (
//                   <Line data={lineData} options={{ responsive: true }} />
//                 ) : (
//                   <div className="text-muted-foreground py-8 text-center">No data for selected range.</div>
//                 )}
//               </CardContent>
//             </Card>
//             {/* Donut Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>By Category</CardTitle>
//               </CardHeader>
//               <CardContent className="flex items-center justify-center">
//                 {donutData.labels.length ? (
//                   <div className="w-64">
//                     <Doughnut data={donutData} options={{ plugins: { legend: { position: "bottom" } } }} />
//                   </div>
//                 ) : (
//                   <div className="text-muted-foreground py-8 text-center">No category data.</div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Bar Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Monthly Totals</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {barData.labels.length ? (
//                 <Bar data={barData} options={{ responsive: true }} />
//               ) : (
//                 <div className="text-muted-foreground py-8 text-center">No monthly data.</div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Budgets Section */}
//           {analytics?.budgets && analytics.budgets.length > 0 && (
//             <div className="mt-8">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Budgets (per category)</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {analytics.budgets.map((b) => {
//                     const spent =
//                       analytics.donutChart.find((d) => d.category === b.category)?.total || 0;
//                     const pct =
//                       b.budget > 0 ? Math.min(100, Math.round((spent / b.budget) * 100)) : 0;
//                     return (
//                       <div key={b.category} className="rounded-xl border p-4 bg-background">
//                         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                           <div>
//                             <div className="text-sm text-muted-foreground">Category</div>
//                             <div className="text-lg font-semibold">{b.category}</div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm text-muted-foreground">Budget</span>
//                             <span className="font-semibold">₹{b.budget.toLocaleString()}</span>
//                           </div>
//                         </div>
//                         <div className="mt-3">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">
//                               Spent: ₹{spent.toLocaleString()}
//                             </span>
//                             <span className="text-muted-foreground">
//                               {b.budget > 0 ? `${pct}% of ₹${b.budget.toLocaleString()}` : "No budget set"}
//                             </span>
//                           </div>
//                           <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden">
//                             <div
//                               style={{ width: `${pct}%` }}
//                               className={`h-full rounded-full ${
//                                 pct < 75
//                                   ? "bg-gradient-to-r from-emerald-500 to-green-500"
//                                   : pct < 100
//                                   ? "bg-gradient-to-r from-amber-500 to-yellow-500"
//                                   : "bg-gradient-to-r from-rose-500 to-red-500"
//                               }`}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


