import { useEffect, useState } from "react";
import { getCategories } from "../api/api";

function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);
  return (
    <select value={value} onChange={onChange} required>
      <option value="">Select category</option>
      {categories.map((c) => (
        <option key={c._id} value={c.name}>{c.name}</option>
      ))}
    </select>
  );
}

export default CategorySelect;