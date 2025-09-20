import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});


// Attach token if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const register = async (formData) => {
  const { data } = await API.post("/users/register", formData);
  return data;
};


export const login = async (email, password) => {
  const { data } = await API.post("/users/login", { email, password });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await API.post("/users/forgot-password", { email });
  return data;
};
export const resetPassword = async (email, code, newPassword) => {
  const { data } = await API.post("/users/reset-password", { email, code, newPassword });
  return data;
};

/* =====================
   Dashboard APIs
===================== */
export const getDashboardOverview = async () => {
  const { data } = await API.get("/dashboard/overview");
  return data;
};

/* =====================
   Financial Record APIs
===================== */
export const getRecords = async () => {
  const { data } = await API.get("/financial-records");
  return data;
};

export const addFinancialRecord = async (record) => {
  const { data } = await API.post("/financial-records", record);
  return data;
};

export const updateRecord = async (id, record) => {
  const { data } = await API.put(`/financial-records/${id}`, record);
  return data;
};

export const deleteRecord = async (id) => {
  await API.delete(`/financial-records/${id}`);
  return id;
};

/* =====================
   Analytics APIs
===================== */
export const getAnalyticsOverview = async () => {
  const { data } = await API.get("/analytics/analytics-overview");
  return data;
};






/* =====================
   Setting APIs
===================== */
// Profile fetch
export const getProfile = async () => {
  const { data } = await API.get("/settings/profile");
  return data;
};

export const getUser = async () => {
  const { data } = await API.get("/users/profile"); 
  return data;
};

// Profile update
export const updateProfile = async (formData) => {
  const { data } = await API.put("/settings/profile", formData);
  return data;
};

// Password
export const changePassword = async (body) => {
  const { data } = await API.put("/settings/change-password", body);
  return data;
};

// Delete account
export const deleteAccount = async () => {
  await API.delete("/settings/account");
};

// Categories
export const addCategory = async (body) => {
  const { data } = await API.post("/categories-tags/category", body);
  return data;
};

export const getCategories = async () => {
  const res = await API.get("/categories-tags");
  return res.data; // <-- Return both categories and tags!
};

export const updateCategory = async (id, body) => {
  // Backend expects { id, name }
  const { data } = await API.put("/categories-tags/category", { id, ...body });
  return data;
};

export const deleteCategory = async (id) => {
  // Backend expects { id }
  await API.delete("/categories-tags/category", { data: { id } });
};


export const addTag = async (body) => {
  const { data } = await API.post("/categories-tags/tag", body);
  return data;
};
export const deleteTag = async (id) => {
  await API.delete("/categories-tags/tag", { data: { id } });
};


/* =====================
   Transactions APIs
===================== */

// Get paginated transactions with KPIs
export const getTransactionsOverview = async (params = {}) => {
  const { data } = await API.get("/transactions/transactions-overview", { params });
  return data;
};

// Add transaction
export const addTransaction = async (body) => {
  const { data } = await API.post("/transactions", body);
  return data;
};

// Edit transaction
export const updateTransaction = async (id, body) => {
  const { data } = await API.put(`/transactions/${id}`, body);
  return data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  await API.delete(`/transactions/${id}`);
};


/* =====================
   Budget APIs
===================== */

export const getBudgetOverview = async () => {
  const { data } = await API.get("/budgets/budget-overview");
  return data;
};
export const addBudget = async (body) => {
  const { data } = await API.post("/budgets", body);
  return data;
};
export const updateBudget = async (id, body) => {
  const { data } = await API.put(`/budgets/${id}`, body);
  return data;
};
export const deleteBudget = async (id) => {
  await API.delete(`/budgets/${id}`);
};


/* =====================
   Insights APIs
===================== */

export const getInsightsOverview = async (period = "monthly") => {
  const { data } = await API.get("/insights/insights-overview", { params: { period } });
  return data;
};


/* =====================
   Calendar APIs
===================== */


// Bills
export const getBills = async () => {
  const { data } = await API.get("/calendar/bills");
  return data;
};
export const addBill = async (bill) => {
  const { data } = await API.post("/calendar/bills", bill);
  return data;
};
export const updateBill = async (id, bill) => {
  const { data } = await API.put(`/calendar/bills/${id}`, bill);
  return data;
};
export const deleteBill = async (id) => {
  await API.delete(`/calendar/bills/${id}`);
  return id;
};


/* =====================
   Notification APIs
===================== */

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};
export const markNotificationAsRead = async (id) => {
  await API.patch(`/notifications/${id}/read`);
};




export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getDashboardOverview,
  getRecords,
  addFinancialRecord,
  updateRecord,
  deleteRecord,
  getAnalyticsOverview,
  getProfile,
  getUser,
  updateProfile,
  changePassword,
  deleteAccount,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addTag,
  deleteTag,
  getTransactionsOverview,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getBudgetOverview,
  addBudget,
  updateBudget,
  deleteBudget,
  getInsightsOverview,
  getBills,
  addBill,
  updateBill,
  deleteBill,
  getNotifications,
  markNotificationAsRead,
};
