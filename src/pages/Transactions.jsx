import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api from "../api/api";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/recordImg/";

export default function TransactionsPage() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [kpis, setKpis] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10; // Fixed page size
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Form state
  const emptyTx = { date: "", type: "income", category: "", amount: "", title: "", image: "", notes: "" };
  const [formTx, setFormTx] = useState(emptyTx);
  const [formImageFile, setFormImageFile] = useState(null);

  // Success message state
  const [successMsg, setSuccessMsg] = useState(""); // <-- NEW

  // Fetch categories and transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const catRes = await api.getCategories();
      setCategories(catRes.categories ? catRes.categories.map(c => c.name) : []);
      // Fetch transactions
      const params = {
        page,
        limit,
        type: filterType,
        category: filterCategory,
        search,
      };
      const data = await api.getTransactionsOverview(params);
      setTransactions(data.transactions || []);
      setKpis(data.kpis || { totalIncome: 0, totalExpenses: 0, netBalance: 0 });
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page, filterType, filterCategory, search]);

  // Add Transaction
  const handleAddTransaction = async () => {
    if (!formTx.date || !formTx.category || !formTx.amount || !formTx.title) {
      alert("Please fill date, category, amount, and title");
      return;
    }
    try {
      let body = { ...formTx, amount: Number(formTx.amount) };
      await api.addFinancialRecord(body); // Use financial record API
      setFormTx(emptyTx);
      setFormImageFile(null);
      setIsAddOpen(false);
      setSuccessMsg("Transaction added successfully!"); // <-- NEW
      fetchTransactions(); // <-- NEW
      setTimeout(() => setSuccessMsg(""), 2500); // <-- NEW
    } catch (err) {
      alert("Failed to add transaction.");
    }
  };

  // Edit Transaction
  const handleSaveEdit = async () => {
    try {
      let body = { ...formTx, amount: Number(formTx.amount) };
      await api.updateRecord(formTx._id, body); // Use financial record API
      setIsEditOpen(false);
      setSelectedTx(null);
      setFormImageFile(null);
      setSuccessMsg("Transaction updated successfully!"); // <-- NEW
      fetchTransactions(); // <-- NEW
      setTimeout(() => setSuccessMsg(""), 2500); // <-- NEW
    } catch (err) {
      alert("Failed to update transaction.");
    }
  };

  // Delete Transaction
  const handleDelete = async (id) => {
    try {
      await api.deleteRecord(id); // Use financial record API
      setIsDeleteOpen(false);
      setSelectedTx(null);
      setSuccessMsg("Transaction deleted successfully!"); // <-- NEW
      fetchTransactions(); // <-- NEW
      setTimeout(() => setSuccessMsg(""), 2500); // <-- NEW
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  // Sorting (client-side for now)
  const sortedTransactions = useMemo(() => {
    let txs = [...transactions];
    txs.sort((a, b) => {
      if (sortKey === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortKey === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    return txs;
  }, [transactions, sortKey, sortOrder]);

  // CSV Export
  const exportCSV = () => {
    const rows = sortedTransactions.map(r => ({
      Date: r.date,
      Type: r.type,
      Category: r.category,
      Title: r.title,
      Amount: r.amount,
      Notes: r.notes,
    }));
    const headers = Object.keys(rows[0] || {});
    const escape = v => `"${String(v ?? "").replaceAll('"','""').replaceAll("\n"," ")}`;
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click(); URL.revokeObjectURL(url);
  };

  // Image preview for form
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return IMAGE_BASE + img;
  };

  // UI
  return (
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 sm:p-4 md:p-6 space-y-6">      {/* Success Message */}
      {successMsg && (
  <div
          className="fixed top-6 right-4 sm:right-8 z-50 bg-green-100 border border-green-300 text-green-700 px-4 sm:px-6 py-3 rounded-lg shadow-lg font-semibold"
          style={{ minWidth: 180, maxWidth: 360, width: "auto" }}
        >
          {successMsg}
        </div>
)}

      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-6 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" onClick={exportCSV}>Export CSV</Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-full sm:w-auto"
            onClick={() => { setFormTx(emptyTx); setFormImageFile(null); setIsAddOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Income</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">₹{kpis.totalIncome?.toLocaleString?.() ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-rose-600">₹{kpis.totalExpenses?.toLocaleString?.() ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Net Balance</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${kpis.netBalance>=0?'text-emerald-600':'text-rose-600'}`}>
              ₹{kpis.netBalance?.toLocaleString?.() ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-2">
        <Input
          placeholder='Search by title, notes or category'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
        <Select value={filterType} onValueChange={v => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Filter Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => { setFilterCategory(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Filter Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Sort By" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setSortOrder(o=> o==="asc" ? "desc" : "asc")}
        >
          Sort: {sortOrder==="asc" ? "↑ Asc" : "↓ Desc"}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(tx => (
              <tr key={tx._id} className="border-b">
                <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className={`px-4 py-2 font-medium ${tx.type==="income" ? "text-green-600":"text-red-600"}`}>{tx.type}</td>
                <td className="px-4 py-2">{tx.category}</td>
                <td className="px-4 py-2">{tx.title}</td>
                <td className="px-4 py-2">₹{tx.amount?.toLocaleString?.() ?? tx.amount}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedTx(tx); setFormTx({...tx}); setFormImageFile(null); setIsEditOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedTx(tx); setIsViewOpen(true); }}><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedTx(tx); setIsDeleteOpen(true); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
            {sortedTransactions.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No transactions match filters.</td></tr>}
          </tbody>
        </table>
      </Card>


      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>


      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white rounded-xl w-full max-w-lg">
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><p className="text-sm font-medium">Date</p><Input type="date" value={formTx.date} onChange={e=>setFormTx({...formTx,date:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Type</p>
              <Select value={formTx.type} onValueChange={(v)=>setFormTx({...formTx,type:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent  className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }} ><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select>
            </div>
            <div><p className="text-sm font-medium">Category</p>
              <Select value={formTx.category} onValueChange={(v)=>setFormTx({...formTx,category:v})}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }} >{categories.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><p className="text-sm font-medium">Title</p><Input value={formTx.title} onChange={e=>setFormTx({...formTx,title:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Amount</p><Input type="number" value={formTx.amount} onChange={e=>setFormTx({...formTx,amount:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Image</p>
              <Input type="file" accept="image/*" onChange={e => setFormImageFile(e.target.files[0])} />
              {formImageFile && (
                <img src={URL.createObjectURL(formImageFile)} alt="preview" className="w-16 h-16 mt-2 rounded object-cover" />
              )}
            </div>
            <div><p className="text-sm font-medium">Notes</p><Input value={formTx.notes} onChange={e=>setFormTx({...formTx,notes:e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>{ setIsAddOpen(false); setFormTx(emptyTx); setFormImageFile(null); }}>Cancel</Button>
            <Button onClick={handleAddTransaction}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-xl w-full max-w-lg">
          <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><p className="text-sm font-medium">Date</p><Input type="date" value={formTx.date} onChange={e=>setFormTx({...formTx,date:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Type</p>
              <Select value={formTx.type} onValueChange={(v)=>setFormTx({...formTx,type:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }} ><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select>
            </div>
            <div><p className="text-sm font-medium">Category</p>
              <Select value={formTx.category} onValueChange={(v)=>setFormTx({...formTx,category:v})}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg" style={{ minWidth: 180 }} >{categories.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><p className="text-sm font-medium">Title</p><Input value={formTx.title} onChange={e=>setFormTx({...formTx,title:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Amount</p><Input type="number" value={formTx.amount} onChange={e=>setFormTx({...formTx,amount:e.target.value})} /></div>
            <div><p className="text-sm font-medium">Image</p>
              <Input type="file" accept="image/*" onChange={e => setFormImageFile(e.target.files[0])} />
              {formImageFile && (
                <img src={URL.createObjectURL(formImageFile)} alt="preview" className="w-16 h-16 mt-2 rounded object-cover" />
              )}
              {!formImageFile && formTx.image && (
                <img src={getImageUrl(formTx.image)} alt="current" className="w-16 h-16 mt-2 rounded object-cover" />
              )}
            </div>
            <div><p className="text-sm font-medium">Notes</p><Input value={formTx.notes} onChange={e=>setFormTx({...formTx,notes:e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>{ setIsEditOpen(false); setSelectedTx(null); setFormImageFile(null); }}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl w-full">
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selectedTx && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <div><b>Date:</b> {new Date(selectedTx.date).toLocaleString()}</div>
                <div><b>Type:</b> {selectedTx.type}</div>
                <div><b>Category:</b> {selectedTx.category}</div>
                <div><b>Title:</b> {selectedTx.title}</div>
                <div><b>Amount:</b> ₹{selectedTx.amount?.toLocaleString?.() ?? selectedTx.amount}</div>
                <div><b>Notes:</b> {selectedTx.notes}</div>
                <div><b>Created At:</b> {new Date(selectedTx.createdAt).toLocaleString()}</div>
                <div><b>Updated At:</b> {new Date(selectedTx.updatedAt).toLocaleString()}</div>
              </div>
              <div className="flex justify-center items-center" style={{ minHeight: "192px" }}>
                {selectedTx.image ? (
                  <img
                    src={getImageUrl(selectedTx.image)}
                    alt="transaction"
                    className="w-48 h-48 object-cover rounded shadow bg-gray-100"
                    style={{ maxWidth: "192px", maxHeight: "192px", minWidth: "128px", minHeight: "128px" }}
                    onError={e => { e.target.src = "/default-image.png"; }}
                  />
                ) : (
                  <div className="text-gray-400 italic">No image uploaded</div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white rounded-xl w-full max-w-md">
          <DialogHeader><DialogTitle>Delete Transaction</DialogTitle></DialogHeader>
          <div>Are you sure you want to delete this transaction?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setSelectedTx(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedTx?._id)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}