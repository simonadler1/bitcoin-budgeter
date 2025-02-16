import React, { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "../types/transaction";

interface FormData {
  title: string;
  date: string;
  amount: string;
}

interface AddTransactionProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ transactions, setTransactions }) => {
  const initialFormState: FormData = {
    title: "",
    date: "",
    amount: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Validate amount input to only allow numbers and a single negative sign
    if (id === "amount") {
      const isValidAmount = /^-?\d*\.?\d*$/.test(value);
      if (value && !isValidAmount) return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Please enter a transaction title");
      return false;
    }

    if (!formData.date) {
      setError("Please select a date");
      return false;
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setError("Please enter a valid amount");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(), // Add unique ID for each transaction
      title: formData.title.trim(),
      date: new Date(formData.date).toISOString().split("T")[0],
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);
    setFormData(initialFormState);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Add new transaction</h3>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter transaction title..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
              <br />
              <span className="text-xs text-gray-500">(negative - expense, positive - income)</span>
            </label>
            <input
              type="text"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add transaction
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransaction;
