"use client";
import { useState } from "react";
import Calendar from "@/app/components/Calendar";
import { Transaction } from "@/app/types/transaction";
import AddTransaction from "@/app/components/AddTransaction";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  return (
    <div className="">
      <Calendar transactions={transactions} />
      <AddTransaction transactions={transactions} setTransactions={setTransactions} />
    </div>
  );
}
