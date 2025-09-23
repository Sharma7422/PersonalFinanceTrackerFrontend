import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "../components/ThemeToggle";
import {
  Download,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Database,
  Trash,
  Menu,
  X,
  User,
  Save,
  FolderPlus,
  Edit,
  Trash2,
  List,
  KeyRound,
} from "lucide-react";
import api from "../api/api";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE + "/userImg/";

export default function SettingsPage() {
  // Theme (use ThemeToggle for switching)
  // UI states
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [twoFA, setTwoFA] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [profile, setProfile] = useState(null); // file
  const [profileUrl, setProfileUrl] = useState(""); // preview

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [catLoading, setCatLoading] = useState(false);

  // Tags state
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [tagLoading, setTagLoading] = useState(false);

  // Feedback
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 80 },
    }),
  };

  // Fetch profile info
  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setName(data.name || "");
      setEmail(data.email || "");
      setPhoneNo(data.phoneNo || "");
      if (data.profile) setProfileUrl(data.profile);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setCatLoading(true);
    setErrorMsg("");
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      setErrorMsg("Failed to load categories");
    } finally {
      setCatLoading(false);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    setTagLoading(true);
    try {
      const res = await api.getCategories();
      setTags(res.tags || []);
    } catch {
      // ignore
    }
    setTagLoading(false);
  };

  // Profile update
  const handleSaveProfile = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNo", phoneNo);
      if (profile) formData.append("profile", profile);

      const res = await api.updateProfile(formData);
      await fetchProfile();
      setSuccessMsg("Profile updated!");

      // Update localStorage and reload to update topbar info after a short delay
      const updatedUser = {
        name: res.data.name,
        avatar: res.data.profile // this is the filename or image path from backend
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Password update
  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccessMsg("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete your account?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.deleteAccount();
      setSuccessMsg("Account deleted. Logging out...");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete account");
    }
  };

  // Category Handlers
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setCatLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.addCategory({ name: newCategory });
      setNewCategory("");
      setSuccessMsg("Category added!");
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add category");
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setCatLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.deleteCategory(id);
      setSuccessMsg("Category deleted!");
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete category");
    } finally {
      setCatLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditIndex(cat._id);
    setEditValue(cat.name);
    setEditId(cat._id);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) return;
    setCatLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.updateCategory(editId, { name: editValue });
      setSuccessMsg("Category updated!");
      setEditIndex(null);
      setEditValue("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update category");
    } finally {
      setCatLoading(false);
    }
  };

  // Tag Handlers
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    setTagLoading(true);
    try {
      await api.addTag({ name: newTag });
      setNewTag("");
      setSuccessMsg("Tag added!");
      fetchTags();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add tag");
    } finally {
      setTagLoading(false);
    }
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm("Delete this tag?")) return;
    setTagLoading(true);
    try {
      await api.deleteTag(id);
      setSuccessMsg("Tag deleted!");
      fetchTags();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete tag");
    } finally {
      setTagLoading(false);
    }
  };

  // Download csv file function
  const handleExportCSV = () => {
    // Prepare CSV headers
    let csv = "Type,Name\n";
    // Add categories
    categories.forEach(cat => {
      csv += `Category,"${cat.name.replace(/"/g, '""')}"\n`;
    });
    // Add tags
    tags.forEach(tag => {
      csv += `Tag,"${tag.name.replace(/"/g, '""')}"\n`;
    });

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finance-data.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  // Profile image preview
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
    if (file) setProfileUrl(URL.createObjectURL(file));
  };

  // Responsive: close sidebar on tab change (mobile)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  // Effects
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted) {
      fetchProfile();
      fetchCategories();
      fetchTags();
    }
    // eslint-disable-next-line
  }, [mounted]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(""), 2000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  if (!mounted) return null;

  function getImageUrl(img) {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return IMAGE_BASE + img;
  }

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-2 sm:p-4 md:p-8 gap-4 md:gap-6 relative min-h-screen">
      {/* Mobile Sidebar Backdrop */}
{sidebarOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

{/* Mobile Toggle Button */}
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="md:hidden fixed top-20 right-4 z-50 p-2.5 bg-primary text-white rounded-lg shadow-lg"
  aria-label="Toggle settings menu"
>
  {sidebarOpen ? <X /> : <Menu />}
</button>

{/* Sidebar */}
<motion.aside
  initial={{ x: -300 }}
  animate={{ x: 0 }}
  exit={{ x: -300 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className={`
    fixed top-0 left-0 z-50 
    w-72 h-full 
    bg-white dark:bg-gray-900 
    p-6 shadow-2xl
    md:static md:shadow-md md:w-64 md:block
    ${sidebarOpen ? "block" : "hidden"}
    overflow-y-auto
  `}
>
  <div className="flex items-center justify-between mb-6 md:mb-8">
    <h3 className="text-xl font-bold">⚙️ Settings</h3>
    <button
      onClick={() => setSidebarOpen(false)}
      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
    >
      <X size={20} />
    </button>
  </div>

  <nav className="space-y-2">
    {[
      { id: "profile", icon: <User size={18} />, label: "Profile" },
      { id: "appearance", icon: <SettingsIcon size={18} />, label: "Appearance" },
      { id: "notifications", icon: <Bell size={18} />, label: "Notifications" },
      { id: "data", icon: <Database size={18} />, label: "Data" },
      { id: "categories", icon: <List size={18} />, label: "Categories" },
      { id: "security", icon: <Shield size={18} />, label: "Security & Privacy" },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`
          flex items-center gap-2 w-full px-4 py-2.5 
          rounded-lg transition-all duration-200
          ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        `}
      >
        {tab.icon} 
        <span className="font-medium">{tab.label}</span>
      </button>
    ))}
  </nav>
</motion.aside>

      {/* Main Content */}
      <motion.div
        key={activeTab}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3 }}
  className="flex-1 bg-white dark:bg-gray-900 shadow-md rounded-xl p-4 sm:p-6 space-y-6"
>
        {/* Feedback */}
        {(successMsg || errorMsg) && (
          <div className={`p-2 rounded text-center font-semibold ${successMsg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {successMsg || errorMsg}
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">👤 Profile</h2>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border">
                  {profileUrl ? (
                    <img src={getImageUrl(profileUrl)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div>
                  <Input type="file" accept="image/*" onChange={handleProfileChange} />
                </div>
              </div>
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="mt-1" />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="mt-4 w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                <Save size={18} /> Save Profile
              </Button>
            </motion.div>
            {/* Password Change */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><KeyRound /> Change Password</h3>
              <div className="flex flex-col gap-3 max-w-md">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Appearance */}
        {activeTab === "appearance" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">🎨 Appearance</h2>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between py-4"
            >
              <Label className="text-lg">Dark Mode</Label>
              <ThemeToggle />
            </motion.div>
          </>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">🔔 Notifications</h2>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <Label className="text-lg">Enable Notifications</Label>
              <Switch
                className="data-[state=checked]:bg-emerald-600"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </motion.div>
          </>
        )}

        {/* Data */}
        {activeTab === "data" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">📂 Data Management</h2>
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <Label className="text-lg">Auto-Save Records</Label>
              <Switch
                className="data-[state=checked]:bg-violet-600"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <Label className="text-lg">Preferred Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="GBP">£ GBP</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                <Download size={18} />
                Export Data (CSV)
              </Button>
            </motion.div>
          </>
        )}

        {/* Categories */}
        {activeTab === "categories" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">📂 Category Manager</h2>
            <div className="space-y-4">
              {/* Add Category */}
              <div className="flex gap-2">
                <Input
                  placeholder="New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={catLoading}
                />
                <Button onClick={handleAddCategory} className="bg-primary hover:bg-primary/90 text-white" disabled={catLoading}>
                  <FolderPlus size={18} /> Add
                </Button>
              </div>

              {/* List Categories */}
              <div className="space-y-2">
                {catLoading ? (
                  <div>Loading...</div>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg"
                    >
                      {editIndex === cat._id ? (
                        <div className="flex gap-2 w-full">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 text-white">
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditIndex(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{cat.name}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCategory(cat)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCategory(cat._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Tag Manager */}
            <h2 className="text-xl font-bold border-b pb-2 mt-8">🏷️ Tag Manager</h2>
            <div className="space-y-4">
              {/* Add Tag */}
              <div className="flex gap-2">
                <Input
                  placeholder="New Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  disabled={tagLoading}
                />
                <Button onClick={handleAddTag} className="bg-primary hover:bg-primary/90 text-white" disabled={tagLoading}>
                  <FolderPlus size={18} /> Add
                </Button>
              </div>
              {/* List Tags */}
              <div className="space-y-2">
                {tagLoading ? (
                  <div>Loading...</div>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg"
                    >
                      <span>{tag.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTag(tag._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <>
            <h2 className="text-2xl font-bold border-b pb-2">🔒 Security & Privacy</h2>
            <motion.div
              custom={6}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <Label className="text-lg">Two-Factor Authentication</Label>
              <Switch
                className="data-[state=checked]:bg-pink-600"
                checked={twoFA}
                onCheckedChange={setTwoFA}
              />
            </motion.div>

            <motion.div
              custom={7}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white animate-pulse"
              >
                <Trash size={18} />
                Delete Account
              </Button>
              <p className="text-sm text-red-500 mt-2">
                ⚠️ This action cannot be undone. Proceed with caution!
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}