import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((toastObj) => {
    // Support both string and object
    const t = typeof toastObj === "string"
      ? { title: toastObj }
      : toastObj;
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toast, toasts };
};