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

  const [customCategories, setCustomCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Default categories for new users
  const defaultCategories = [
    // Income categories
    { name: "Salary", type: "income" },
    { name: "Business", type: "income" },
    { name: "Freelance", type: "income" },
    { name: "Investment", type: "income" },
    { name: "Gift", type: "income" },
    { name: "Other Income", type: "income" },
    
    // Expense categories
    { name: "Food & Dining", type: "expense" },
    { name: "Transportation", type: "expense" },
    { name: "Shopping", type: "expense" },
    { name: "Entertainment", type: "expense" },
    { name: "Bills & Utilities", type: "expense" },
    { name: "Healthcare", type: "expense" },
    { name: "Education", type: "expense" },
    { name: "Travel", type: "expense" },
    { name: "Insurance", type: "expense" },
    { name: "Home & Garden", type: "expense" },
    { name: "Personal Care", type: "expense" },
    { name: "Other Expense", type: "expense" },
  ];

  // Fetch custom categories from API
  useEffect(() => {
    getCategories()
      .then((res) => setCustomCategories(res.categories || []))
      .catch(() => setCustomCategories([]));
  }, []);

  // Filter categories based on selected type
  const getFilteredCategories = () => {
    const filteredDefaults = defaultCategories.filter(cat => 
      !type || cat.type === type
    );
    
    const filteredCustom = customCategories.filter(cat => 
      !type || cat.type === type
    );
    
    return {
      defaults: filteredDefaults,
      custom: filteredCustom
    };
  };

  // Handle category selection with auto-creation
  const handleCategoryChange = async (selectedCategory) => {
    const existsInCustom = customCategories.some(cat => cat.name === selectedCategory);
    const isDefaultCategory = defaultCategories.some(cat => cat.name === selectedCategory);
    
    // If it's a default category that doesn't exist in custom categories, create it
    if (!existsInCustom && isDefaultCategory) {
      try {
        const defaultCat = defaultCategories.find(cat => cat.name === selectedCategory);
        await api.addCategory({
          name: defaultCat.name,
          type: defaultCat.type,
          description: `Auto-created default category`
        });
        // Refresh categories after adding
        const catRes = await getCategories();
        setCustomCategories(catRes.categories || []);
      } catch (catError) {
        console.warn("Could not auto-create category:", catError);
      }
    }
    
    setCategory(selectedCategory);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Enhanced validation
    if (!title || !type || !category || !date || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if category needs to be auto-created
      const selectedCategory = customCategories.find(cat => cat.name === category);
      
      if (!selectedCategory && defaultCategories.some(cat => cat.name === category)) {
        try {
          const defaultCat = defaultCategories.find(cat => cat.name === category);
          await api.addCategory({
            name: defaultCat.name,
            type: defaultCat.type,
            description: `Auto-created default category`
          });
          // Refresh categories after adding
          const catRes = await getCategories();
          setCustomCategories(catRes.categories || []);
        } catch (catError) {
          console.warn("Could not auto-create category:", catError);
        }
      }

      const formData = new FormData();
      formData.append("user", userId);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("amount", Number(amount));
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
          title: "Success",
          description: "Record added successfully!",
        });
        if (onSubmitComplete) onSubmitComplete();
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Error saving record:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to save record";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { defaults, custom } = getFilteredCategories();
  
  // Filter out default categories that already exist as custom categories
  const availableDefaults = defaults.filter(defaultCat => 
    !custom.some(customCat => customCat.name === defaultCat.name)
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg"
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
        className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
      />

      {/* Type */}
      <Select value={type} onValueChange={(value) => {
        setType(value);
        setCategory(""); // Reset category when type changes
      }}>
        <SelectTrigger className="rounded-xl border w-full bg-white dark:bg-gray-800 border-primary/30 dark:border-blue-900 focus:ring-primary">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px]">
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select value={category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="rounded-xl border w-full bg-white dark:bg-gray-800 border-primary/30 dark:border-blue-900 focus:ring-primary">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px] max-h-60 overflow-y-auto">
          {/* Custom Categories First */}
          {custom.map((cat) => (
            <SelectItem key={cat._id} value={cat.name}>
              <span className="flex items-center gap-2">
                {cat.name}
                <span className="text-xs text-blue-500">•</span>
              </span>
            </SelectItem>
          ))}
          
          {/* Default Categories */}
          {availableDefaults.length > 0 && (
            <>
              {custom.length > 0 && (
                <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-1">
                  Default Categories
                </div>
              )}
              {availableDefaults.map((cat, index) => (
                <SelectItem key={`default-${index}`} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </>
          )}
          
          {/* No categories message */}
          {custom.length === 0 && availableDefaults.length === 0 && (
            <SelectItem disabled value="">
              No categories available - Create one in Settings
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Date */}
      <Input
        type="datetime-local"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
      />

      {/* Amount */}
      <Input
        type="number"
        placeholder="Amount"
        required
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
      />

      {/* Image */}
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
        />
        {image && (
          <div className="flex items-center gap-2">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg shadow-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImage(null)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Submit */}
      <AnimatePresence>
        {!success ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl py-2 bg-primary hover:bg-primary/90 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
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


// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import { useToast } from "@/components/ui/use-toast";
// import { CheckCircle2 } from "lucide-react";
// import api, { getCategories } from "../../api/api";

// const FinancialRecordForm = ({ onSubmitComplete, userId }) => {
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("");
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState("");
//   const [amount, setAmount] = useState("");
//   const [image, setImage] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Fetch categories from API on mount
//   useEffect(() => {
//     getCategories().then((res) => setCategories(res.categories || []));
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("user", userId);
//       formData.append("title", title);
//       formData.append("type", type);
//       formData.append("category", category);
//       formData.append("date", date);
//       formData.append("amount", amount);
//       if (image) formData.append("image", image);

//       await api.addFinancialRecord(formData);

//       // Reset fields
//       setTitle("");
//       setType("");
//       setCategory("");
//       setDate("");
//       setAmount("");
//       setImage(null);

//       setSuccess(true);
//       setTimeout(() => {
//         setSuccess(false);
//         toast({
//           title: "Record added successfully",
//         });
//         if (onSubmitComplete) onSubmitComplete();
//         navigate("/");
//       }, 1000);
//     } catch (err) {
//       alert("Failed to save record: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Title */}
//       <Input
//         placeholder="Title"
//         required
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
//       />

//       {/* Type */}
//       <Select value={type} onValueChange={setType}>
//         <SelectTrigger className="rounded-xl border w-full bg-white dark:bg-gray-800 border-primary/30 dark:border-blue-900 focus:ring-primary">
//           <SelectValue placeholder="Select type" />
//         </SelectTrigger>
//         <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px]">
//           <SelectItem value="expense">Expense</SelectItem>
//           <SelectItem value="income">Income</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* Category */}
//       <Select value={category} onValueChange={setCategory}>
//         <SelectTrigger className="rounded-xl border w-full bg-white dark:bg-gray-800 border-primary/30 dark:border-blue-900 focus:ring-primary">
//           <SelectValue placeholder="Select category" />
//         </SelectTrigger>
//         <SelectContent className="z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full min-w-[180px]">
//           {categories.map((cat) => (
//             <SelectItem key={cat._id} value={cat.name}>
//               {cat.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Date */}
//       <Input
//         type="datetime-local"
//         required
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
//       />

//       {/* Amount */}
//       <Input
//         type="number"
//         placeholder="Amount"
//         required
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
//       />

//       {/* Image */}
//       <Input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//         className="rounded-xl w-full bg-white dark:bg-gray-800 border border-primary/30 dark:border-blue-900 focus:ring-primary"
//       />

//       {/* Submit */}
//       <AnimatePresence>
//         {!success ? (
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full rounded-xl py-2 bg-primary hover:bg-primary/90 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
//           >
//             {isSubmitting ? "Saving..." : "Save Record"}
//           </Button>
//         ) : (
//           <motion.div
//             key="success"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0 }}
//             className="w-full flex justify-center items-center bg-green-500 text-white py-3 rounded-xl font-semibold"
//           >
//             <CheckCircle2 className="mr-2 w-6 h-6 animate-bounce" /> Saved!
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.form>
//   );
// };

// export default FinancialRecordForm;