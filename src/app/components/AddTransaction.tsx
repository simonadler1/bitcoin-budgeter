import React, { useState, ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  const [isOpen, setIsOpen] = useState(false);
  const initialFormState: FormData = {
    title: "",
    date: "",
    amount: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string>("");

  const hasUnsavedChanges = (): boolean => {
    return formData.title !== "" || formData.date !== "" || formData.amount !== "";
  };

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges()) {
      const willClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (willClose) {
        handleCancel();
      }
      return willClose;
    }
    handleCancel();
    return true;
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setError("");
    setIsOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

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
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      date: new Date(formData.date).toISOString().split("T")[0],
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);
    setFormData(initialFormState);
    setIsOpen(false); // Close the modal after successful submission
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 
                   rounded-full shadow-lg flex items-center justify-center 
                   transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Modal Dialog */}
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            console.log("open is false!");
            handleCloseAttempt();
          } else {
            console.log("in else");
            setIsOpen(true);
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Add new transaction</AlertDialogTitle>
          </AlertDialogHeader>

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

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                         hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                         hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add transaction
              </button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddTransaction;
