type Transaction = {
  title: string;
  date: string; // Format: "YYYY-MM-DD"
  amount: number;
  id?: string | number; // Optional ID field for tracking unique transactions
  createdAt?: Date | string; // Optional field to track when the transaction was created
};
export type { Transaction };
