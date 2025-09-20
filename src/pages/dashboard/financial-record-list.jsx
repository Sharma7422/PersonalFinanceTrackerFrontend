import React, { useMemo, useState } from "react";
import { useFinancialRecords } from "../../contexts/FinancialRecordProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2 } from "lucide-react";
import api from "../../api/api";
import { useToast } from "@/components/ui/use-toast";

// Category Badge Colors
const categoryColors = {
  "Food & Groceries":
    "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100",
  Rent: "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100",
  Salary: "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100",
  Utilities: "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100",
  Entertainment: "bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-purple-100",
  Other: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100",
};

const categories = [
  "Food & Groceries",
  "Rent",
  "Salary",
  "Utilities",
  "Entertainment",
  "Other",
];

const FinancialRecordList = ({ records: propRecords = [], onDataChanged }) => {
  const {
    records: contextRecords = [],
    deleteRecord,
    updateRecordInContext,
  } = useFinancialRecords();

  const { toast } = useToast();

  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const records = propRecords.length > 0 ? propRecords : contextRecords;

  const columns = useMemo(
    () => ["Title", "Amount", "Category", "Type", "Date", "Actions"],
    []
  );

  // Save edited record with FormData
  const handleSaveEdit = async () => {
    if (!editRecord) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", editRecord.title);
      formData.append("amount", editRecord.amount);
      formData.append("category", editRecord.category);
      formData.append("type", editRecord.type);
      formData.append("date", editRecord.date);

      if (editRecord.imageFile) {
        formData.append("image", editRecord.imageFile);
      }

      const updated = await api.updateRecord(editRecord._id, formData);
      updateRecordInContext(updated);
      setEditRecord(null);
      if (onDataChanged) onDataChanged();

      toast({
        title: "Record updated successfully",
      });
    } catch (err) {
      toast({
        title: "Record update failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete record with toast
  const handleDelete = async (id, title) => {
    try {
      await deleteRecord(id);
      if (onDataChanged) onDataChanged();
      toast({
        title: "Record deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const RECORD_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/recordImg/";

  function getImageUrl(img) {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return RECORD_IMAGE_BASE + img;
  }

  return (
    <>
      <div className="w-full px-0 md:px-8 py-8">
        {/* Desktop/tablet table */}
        <div className="w-full overflow-x-auto hidden sm:block">
          <Table className="min-w-full border-separate border-spacing-y-2">
            <TableHeader>
              <TableRow className="bg-primary/10 dark:bg-primary/20">
                {columns.map((col) => (
                  <TableHead key={col} className="text-xl py-5 px-4 font-bold text-primary dark:text-blue-200">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-500 py-10 text-lg"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, idx) => (
                  <TableRow
                    key={record._id || idx}
                    className="transition hover:bg-primary/5 dark:hover:bg-gray-700 rounded-2xl"
                    style={{ boxShadow: "0 2px 12px 0 rgba(37,99,235,0.06)" }}
                  >
                    <TableCell className="font-semibold text-lg px-4">{record.title || "-"}</TableCell>
                    <TableCell className="font-bold text-primary dark:text-blue-400 px-4">
                      ₹{record.amount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="px-4">
                      <span
                        className={`px-4 py-2 rounded-full text-base font-medium ${
                          categoryColors[record.category] ||
                          "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                        }`}
                      >
                        {record.category || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize px-4">{record.type || "-"}</TableCell>
                    <TableCell className="px-4">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="flex gap-2 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewRecord(record)}
                        className="hover:bg-primary/10 dark:hover:bg-blue-900"
                      >
                        <Eye className="h-5 w-5 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditRecord(record)}
                        className="hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        <Edit className="h-5 w-5 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record._id, record.title)}
                        className="hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-4">
          {records.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-lg bg-white dark:bg-gray-800 rounded-xl shadow">
              No records found.
            </div>
          ) : (
            records.map((record, idx) => (
              <div
                key={record._id || idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">{record.title || "-"}</div>
                  <div className="font-bold text-primary dark:text-blue-400 text-lg">
                    ₹{record.amount?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[record.category] ||
                      "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                  >
                    {record.category || "Uncategorized"}
                  </span>
                  <span className="capitalize text-sm">{record.type || "-"}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {record.date
                      ? new Date(record.date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewRecord(record)}
                    className="hover:bg-primary/10 dark:hover:bg-blue-900"
                  >
                    <Eye className="h-5 w-5 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditRecord(record)}
                    className="hover:bg-green-100 dark:hover:bg-green-900"
                  >
                    <Edit className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(record._id, record.title)}
                    className="hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Record Details</DialogTitle>
          </DialogHeader>
          {viewRecord && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p><strong>Title:</strong> {viewRecord.title}</p>
                <p><strong>Amount:</strong> ₹{viewRecord.amount}</p>
                <p><strong>Category:</strong> {viewRecord.category}</p>
                <p><strong>Type:</strong> {viewRecord.type}</p>
                <p><strong>Date:</strong> {new Date(viewRecord.date).toLocaleString()}</p>
              </div>
              <div className="flex justify-center items-center" style={{ minHeight: "256px" }}>
                {viewRecord.image ? (
                  <img
                    src={getImageUrl(viewRecord.image)}
                    alt="Receipt"
                    className="rounded-xl shadow-xl w-64 h-64 object-cover bg-gray-100"
                    style={{ maxWidth: "256px", maxHeight: "256px", minWidth: "128px", minHeight: "128px" }}
                  />
                ) : (
                  <div className="text-gray-400 italic">No image uploaded</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRecord} onOpenChange={() => setEditRecord(null)}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Record</DialogTitle>
          </DialogHeader>
          {editRecord && (
            <div className="space-y-4">
              <Input
                value={editRecord.title}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, title: e.target.value })
                }
                placeholder="Title"
                className="w-full"
              />
              <Input
                type="number"
                value={editRecord.amount}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, amount: e.target.value })
                }
                placeholder="Amount"
                className="w-full"
              />
              <Select
                value={editRecord.category}
                onValueChange={(val) =>
                  setEditRecord({ ...editRecord, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={editRecord.type}
                onValueChange={(val) =>
                  setEditRecord({ ...editRecord, type: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 z-50 shadow-lg w-full" style={{ minWidth: 180 }} >
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                value={
                  editRecord.date
                    ? new Date(editRecord.date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditRecord({ ...editRecord, date: e.target.value })
                }
                className="w-full"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditRecord({ ...editRecord, imageFile: e.target.files[0] })
                }
                className="w-full"
              />
              <Button
                className="w-full bg-primary text-white dark:bg-blue-600"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialRecordList;