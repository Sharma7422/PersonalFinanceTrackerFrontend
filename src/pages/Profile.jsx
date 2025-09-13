import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialRecords } from "@/contexts/FinancialRecordProvider";
import api from "../api/api";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/userImg/";

export default function ProfilePage() {
  const { records } = useFinancialRecords();

  // --- States for profile update ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const [phoneNo, setPhoneNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await api.getProfile();
        setFullName(data.name || "");
        setEmail(data.email || "");
        setPhoneNo(data.phoneNo || "");
        if (data.profile) setImagePreview(data.profile);
      } catch (err) {
        setErrorMsg("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle file upload + preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("phoneNo", phoneNo);
      if (file) formData.append("profile", file);

      await api.updateProfile(formData);
      setSuccessMsg("Profile updated!");
    } catch (err) {
      setErrorMsg("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- Financial calculations (unchanged) ---
  const totalExpenses = records.reduce(
    (sum, r) => sum + (r.type === "expense" ? r.amount : 0),
    0
  );
  const totalIncome = records.reduce(
    (sum, r) => sum + (r.type === "income" ? r.amount : 0),
    0
  );
  const balance = totalIncome - totalExpenses;

  // --- Biggest expense category ---
  const expenseByCategory = records
    .filter((r) => r.type === "expense")
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {});
  const biggestExpenseCategory =
    Object.keys(expenseByCategory).length > 0
      ? Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0][0]
      : "None";

  // --- Monthly stats ---
  const currentMonth = new Date().getMonth();
  const monthlyRecords = records.filter(
    (r) => new Date(r.date).getMonth() === currentMonth
  ).length;

  // --- Motion variants ---
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, type: "spring", stiffness: 80 }
    })
  };

  function getImageUrl(img) {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return IMAGE_BASE + img;
  }


  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full min-h-[80vh] flex items-center justify-center px-2 sm:px-4 md:px-8 lg:px-16"
  >
    <motion.section
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="relative bg-gradient-to-br from-indigo-50/80 to-white/90 dark:from-gray-900/80 dark:to-gray-800/90 shadow-2xl rounded-3xl p-4 sm:p-8 w-full max-w-2xl border border-white/30 backdrop-blur-lg"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-200 tracking-tight text-center">
        Update Profile
      </h2>
      <form onSubmit={handleProfileUpdate} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
        >
          <motion.img
            src={getImageUrl(imagePreview)}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-indigo-200 dark:border-indigo-700 object-cover shadow-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.08, rotate: 2 }}
          />
          <div className="w-full">
            <Label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Upload New Picture</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} className="bg-white dark:bg-gray-900 w-full" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Full Name</Label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white dark:bg-gray-900"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-gray-900"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.21 }}
        >
          <Label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Phone</Label>
          <Input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full bg-white dark:bg-gray-900"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center"
        >
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>

        {/* Success/Error Messages */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed top-6 right-8 z-50 bg-green-100 border border-green-300 text-green-700 px-6 py-3 rounded-lg shadow-lg font-semibold"
            style={{ minWidth: 240, maxWidth: 360, width: "auto" }}
          >
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed top-24 right-8 z-50 bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg shadow-lg font-semibold"
            style={{ minWidth: 240, maxWidth: 360, width: "auto" }}
          >
            {errorMsg}
          </motion.div>
        )}
      </form>
    </motion.section>
  </motion.div>
);
}


