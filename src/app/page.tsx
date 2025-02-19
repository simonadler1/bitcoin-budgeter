"use client";
import { useState, useEffect } from "react";
import Calendar from "@/app/components/Calendar";
import { Transaction } from "@/app/types/transaction";
import AddTransaction from "@/app/components/AddTransaction";

const LOCAL_STORAGE_KEY = "transactions";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error("Failed to load transactions from localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTransactions();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    // Skip saving on initial load to prevent overwriting data
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error("Failed to save transactions to localStorage:", error);
      }
    }
  }, [transactions, isLoaded]);

  // Enhanced setTransactions that also saves to localStorage
  const handleSetTransactions = (newTransactions: Transaction[] | ((prev: Transaction[]) => Transaction[])) => {
    setTransactions(newTransactions);
  };

  return (
    <div className="">
      <Calendar transactions={transactions} />
      <AddTransaction transactions={transactions} setTransactions={handleSetTransactions} />
    </div>
  );
}
