import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getBills, addBill, updateBill, deleteBill } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaMoneyBillWave, FaCalendarCheck, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helper to get YYYY-MM-DD in local time
function toLocalDateString(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function FinancialCalendar() {
  const [bills, setBills] = useState([]);
  const [selected, setSelected] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "" });
  const [editing, setEditing] = useState(null);

  // Fetch all data
  const fetchAll = async () => {
    setBills(await getBills());
  };

  useEffect(() => { fetchAll(); }, []);

  // Filter items for selected date (local date)
  const day = toLocalDateString(selected);
  const dayBills = bills.filter(b => toLocalDateString(b.dueDate) === day);

  // Upcoming bills within 5 days from today
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  const upcomingBills = bills.filter(b => {
    const due = new Date(b.dueDate);
    return due >= today && due <= fiveDaysLater;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Handle form input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Open modal for add/edit
  const openModal = (item = null) => {
    if (item) {
      setEditing(item._id);
      setForm({
        name: item.name || "",
        amount: item.amount || "",
        dueDate: toLocalDateString(item.dueDate) || day,
      });
    } else {
      setEditing(null);
      setForm({ name: "", amount: "", dueDate: day });
    }
    setModalOpen(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateBill(editing, { ...form });
    } else {
      await addBill(form);
    }
    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", amount: "", dueDate: "" });
    fetchAll();
  };

  // Delete item
  const handleDelete = async (id) => {
    await deleteBill(id);
    fetchAll();
  };

  // Event Card
  const EventCard = ({ icon, color, title, subtitle, onEdit, onDelete }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex flex-col sm:flex-row items-center gap-3 p-5 rounded-2xl shadow bg-white dark:bg-gray-800`}
    >
      <span className={`text-3xl ${color}`}>{icon}</span>
      <div className="flex-1 text-center sm:text-left">
        <div className="font-semibold text-lg">{title}</div>
        {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>}
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0">
        <Button size="sm" variant="outline" onClick={onEdit} className="w-full sm:w-auto">Edit</Button>
        <Button size="sm" variant="destructive" onClick={onDelete} className="w-full sm:w-auto">Delete</Button>
      </div>
    </motion.div>
  );

  const validBills = bills.filter(b => b.dueDate);

  return (
    <div className="w-full p-2 sm:p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-2 sm:px-4"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 mb-2">
            <FaCalendarCheck className="text-primary dark:text-blue-300" /> Financial Calendar
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Track your bills in one place. Click a date to view or add bills!
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white flex items-center px-6 py-3 text-base sm:text-lg rounded-2xl shadow-lg w-full md:w-auto"
          style={{ minWidth: 180 }}
        >
          <FaPlus className="mr-2" /> Add Bill
        </Button>
      </motion.div>

      <div className="w-full flex flex-col lg:flex-row gap-10">
        {/* Calendar */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-8 min-w-[280px] max-w-2xl mx-auto lg:mx-0">
          <Calendar
            value={selected}
            onChange={setSelected}
            tileContent={({ date }) => {
              if (!(date instanceof Date) || isNaN(date)) return null;
              const d = toLocalDateString(date);
              return (
                <div className="flex gap-1 justify-center">
                  {validBills.some(b => toLocalDateString(b.dueDate) === d) && (
                    <FaMoneyBillWave title="Bill" className="text-rose-500 text-xl" />
                  )}
                </div>
              );
            }}
            className="rounded-xl w-full"
            prev2Label={null}
            next2Label={null}
            showNeighboringMonth={false}
            onClickDay={() => openModal()}
          />
        </div>

        {/* Events for selected date and upcoming bills */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          <div className="sticky top-0 bg-transparent z-10 pb-2">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-6">
              Bills for <span className="text-primary dark:text-blue-300">{selected.toDateString()}</span>
            </h3>
          </div>
          <div className="space-y-6">
            <AnimatePresence>
              {dayBills.map(b => (
                <EventCard
                  key={b._id}
                  icon={<FaMoneyBillWave />}
                  color="text-rose-500"
                  title={`${b.name} (₹${b.amount})`}
                  subtitle={`Bill`}
                  onEdit={() => openModal(b)}
                  onDelete={() => handleDelete(b._id)}
                />
              ))}
              {dayBills.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 dark:text-gray-500 text-center mt-12 text-lg"
                >
                  No bills for this date.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upcoming Bills (within 5 days) */}
          <div className="mt-10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-rose-600 flex items-center gap-2">
              <FaMoneyBillWave /> Upcoming Bills (Next 5 Days)
            </h3>
            <div className="space-y-4">
              <AnimatePresence>
                {upcomingBills.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 dark:text-gray-500 text-center"
                  >
                    No upcoming bills in the next 5 days.
                  </motion.div>
                )}
                {upcomingBills.map(b => (
                  <EventCard
                    key={b._id}
                    icon={<FaMoneyBillWave />}
                    color="text-rose-500"
                    title={`${b.name} (₹${b.amount})`}
                    subtitle={`Due: ${toLocalDateString(b.dueDate)}`}
                    onEdit={() => openModal(b)}
                    onDelete={() => handleDelete(b._id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-transparent shadow-none flex items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl mb-2">
              {editing ? "Edit Bill" : "Add Bill"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-8 shadow-xl w-full max-w-md mx-auto border-0"
            style={{ border: "none" }}
          >
            <input
              type="text"
              name="name"
              placeholder="Bill Name"
              value={form.name}
              onChange={handleChange}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="date"
              name="dueDate"
              placeholder="Due Date"
              value={form.dueDate}
              onChange={handleChange}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white rounded-xl py-3 text-base sm:text-lg font-semibold w-full"
            >
              {editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}