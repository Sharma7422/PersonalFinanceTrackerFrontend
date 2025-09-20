import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../api/api";

const categoryColors = [
  "bg-primary", // blue
  "bg-pink-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-teal-500",
];

function getCategoryColor(idx) {
  return categoryColors[idx % categoryColors.length];
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Add/Edit Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState({ category: "", limit: "", icon: "", name: "" });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.getBudgetOverview();
      setBudgets(res.budgets || []);
    } catch (err) {
      setBudgets([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.categories ? res.categories.map(c => c.name) : []);
    } catch (err) {
      setCategories([]);
    }
  };

  // Add Budget
  const handleAddBudget = async () => {
    if (!form.category || !form.limit) {
      alert("Please select category and enter limit");
      return;
    }
    try {
      await api.addBudget({
        name: form.name || form.category,
        amount: Number(form.limit),
        category: form.category,
        icon: form.icon,
      });
      setIsAddOpen(false);
      setForm({ category: "", limit: "", icon: "", name: "" });
      fetchBudgets();
    } catch (err) {
      alert("Failed to add budget.");
    }
  };

  // Edit Budget
  const handleEditBudget = async () => {
    if (!form.category || !form.limit) {
      alert("Please select category and enter limit");
      return;
    }
    try {
      await api.updateBudget(selectedBudget.id, {
        name: form.name || form.category,
        amount: Number(form.limit),
        category: form.category,
        icon: form.icon,
      });
      setIsEditOpen(false);
      setForm({ category: "", limit: "", icon: "", name: "" });
      setSelectedBudget(null);
      fetchBudgets();
    } catch (err) {
      alert("Failed to update budget.");
    }
  };

  // Delete Budget
  const handleDeleteBudget = async () => {
    try {
      await api.deleteBudget(selectedBudget.id);
      setIsDeleteOpen(false);
      setSelectedBudget(null);
      fetchBudgets();
    } catch (err) {
      alert("Failed to delete budget.");
    }
  };

  // Open Drawer for details
  const openDrawer = (budget) => {
    setSelectedBudget(budget);
    setDrawerOpen(true);
  };

  // Open Edit Dialog
  const openEdit = (budget) => {
    setSelectedBudget(budget);
    setForm({
      category: budget.category,
      limit: budget.limit,
      icon: budget.icon || "",
      name: budget.name || budget.category,
    });
    setIsEditOpen(true);
  };

  // Open Delete Dialog
  const openDelete = (budget) => {
    setSelectedBudget(budget);
    setIsDeleteOpen(true);
  };

  // Color for progress
  const getColor = (percent) =>
    percent < 80 ? "bg-green-500" : percent < 100 ? "bg-yellow-500" : "bg-red-500";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary dark:text-blue-300">Budgets</h2>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg w-full sm:w-auto"
        >
          <Plus size={18} /> Add Budget
        </Button>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {budgets.map((budget, idx) => {
            const percent = Math.min((budget.spent / budget.limit) * 100, 100);
            return (
              <motion.div
                key={budget.id}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(80,80,200,0.18)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <Card
                  className={`p-4 sm:p-6 rounded-2xl relative group border-2 transition-all duration-300 ${
                    percent >= 100
                      ? "border-red-500"
                      : percent >= 80
                      ? "border-yellow-400"
                      : "border-primary"
                  } bg-white dark:bg-gray-900`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold shadow ${getCategoryColor(
                          idx
                        )}`}
                      >
                        {budget.icon || "💰"}
                      </span>
                      <span className="text-lg font-semibold">{budget.category}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">₹{budget.limit}</span>
                  </div>
                  <Progress
                    value={percent}
                    className="h-3"
                    indicatorClassName={getColor(percent)}
                    animate
                  />
                  <p className="mt-3 text-sm">
                    Spent: <span className="font-medium">₹{budget.spent}</span> / ₹{budget.limit}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => openDrawer(budget)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => openEdit(budget)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => openDelete(budget)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {budgets.length === 0 && (
          <motion.div
            className="col-span-full text-center text-muted-foreground py-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl mb-4">📊</span>
            <div className="text-lg font-semibold mb-2">No budgets found</div>
            <div className="mb-4">Click <b>Add Budget</b> to create your first budget.</div>
          </motion.div>
        )}
      </div>

      {/* Drawer for Category Details */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-t-2xl shadow-lg max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
                <span className="text-2xl">{selectedBudget?.icon || "💰"}</span>
                {selectedBudget?.category} Details
              </DrawerTitle>
            </DrawerHeader>
            {/* Monthly Summary */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">Monthly Summary</h4>
              <Progress
                value={(selectedBudget?.spent / selectedBudget?.limit) * 100}
                className="h-3"
                indicatorClassName={getColor((selectedBudget?.spent / selectedBudget?.limit) * 100)}
                animate
              />
              <p className="mt-2 text-sm">
                <span className="font-medium">₹{selectedBudget?.spent}</span> of ₹
                {selectedBudget?.limit} used
              </p>
            </div>
            {/* Transactions */}
            <div className="px-2 max-h-60 overflow-y-auto">
              <h4 className="font-semibold mb-3">This Month’s Transactions</h4>
              <AnimatePresence>
                {selectedBudget?.recentTransactions?.length ? (
                  selectedBudget.recentTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      className="flex justify-between border-b py-2"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: index * 0.07 }}
                    >
                      <span>
                        {tx.notes} (₹{tx.amount})
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No transactions for this category this month.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </motion.div>
        </DrawerContent>
      </Drawer>

      {/* Add Budget Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  {categories.map((c, idx) => (
                    <SelectItem key={c} value={c}>
                      <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getCategoryColor(idx)}`}></span>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Limit (₹)</label>
              <Input
                type="number"
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                placeholder="Enter budget limit"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Icon (optional)</label>
              <Input
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. 🍔"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Name (optional)</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Budget name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBudget}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  {categories.map((c, idx) => (
                    <SelectItem key={c} value={c}>
                      <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getCategoryColor(idx)}`}></span>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Limit (₹)</label>
              <Input
                type="number"
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                placeholder="Enter budget limit"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Icon (optional)</label>
              <Input
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. 🍔"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Name (optional)</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Budget name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBudget}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Budget Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this budget?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBudget}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}