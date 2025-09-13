import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api"; // ✅ central API file

export const FinancialRecordsContext = createContext(undefined);

export const FinancialRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all records from API
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await api.getRecords();
      setRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Add record
  const addRecord = async (record) => {
    try {
      const newRecord = await api.addFinancialRecord(record);
      setRecords((prev) => [...prev, newRecord]);
    } catch (err) {
      console.error("Failed to add record:", err);
      setError(err.message);
    }
  };

  // ✅ Update record with backend call
  const updateRecord = async (_id, updatedRecord) => {
    try {
      const updated = await api.updateRecord(_id, updatedRecord);
      setRecords((prev) =>
        prev.map((rec) => (rec._id === _id ? updated : rec))
      );
      return updated;
    } catch (err) {
      console.error("Failed to update record:", err);
      setError(err.message);
      throw err;
    }
  };

  // ✅ Update state only (used when modal saves successfully)
  const updateRecordInContext = (updated) => {
    setRecords((prev) =>
      prev.map((rec) => (rec._id === updated._id ? updated : rec))
    );
  };

  // ✅ Delete record
  const deleteRecord = async (_id) => {
    try {
      await api.deleteRecord(_id);
      setRecords((prev) => prev.filter((rec) => rec._id !== _id));
    } catch (err) {
      console.error("Failed to delete record:", err);
      setError(err.message);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{
        records,
        loading,
        error,
        addRecord,
        updateRecord,
        updateRecordInContext,
        deleteRecord,
      }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) {
    throw new Error("Context Not Found");
  }
  return context;
};



