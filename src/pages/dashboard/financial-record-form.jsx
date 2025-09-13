import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";
import api, { getCategories } from "../../api/api";

const FinancialRecordForm = ({ onSubmitComplete, userId }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch categories from API on mount
  useEffect(() => {
    getCategories().then((res) => setCategories(res.categories || []));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user", userId);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("amount", amount);
      if (image) formData.append("image", image);

      await api.addFinancialRecord(formData);

      // Reset fields
      setTitle("");
      setType("");
      setCategory("");
      setDate("");
      setAmount("");
      setImage(null);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        toast({
          title: "Record added successfully",
        });
        if (onSubmitComplete) onSubmitComplete();
        navigate("/");
      }, 1000);
    } catch (err) {
      alert("Failed to save record: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <Input
        placeholder="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-xl w-full"
      />

      {/* Type */}
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="rounded-xl border w-full">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px]">
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="rounded-xl border w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px]">
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date */}
      <Input
        type="datetime-local"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-xl w-full"
      />

      {/* Amount */}
      <Input
        type="number"
        placeholder="Amount"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-xl w-full"
      />

      {/* Image */}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="rounded-xl w-full"
      />

      {/* Submit */}
      <AnimatePresence>
        {!success ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2"
          >
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-full flex justify-center items-center bg-green-500 text-white py-3 rounded-xl font-semibold"
          >
            <CheckCircle2 className="mr-2 w-6 h-6 animate-bounce" /> Saved!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default FinancialRecordForm;


