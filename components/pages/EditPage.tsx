import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const defaultIncomeCategories = ["Paycheck", "Freelance Gig", "Gift"];
const defaultExpenseCategories = ["Want", "Need"];

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

type CustomCategories = {
  income: string[];
  expense: string[];
};

type EditPageProps = {
  type: "income" | "expense";
  amount: string;
  category: string;
  date: string;
  setType: (t: "income" | "expense") => void;
  setAmount: (a: string) => void;
  setCategory: (c: string) => void;
  setDate: (d: string) => void;
  addTransaction: () => void;
  transactions: Transaction[];
  initialBalance: number;
  setInitialBalance: (b: number) => void;
  deleteTransaction: (id: number) => void;
  customCategories: CustomCategories;
  addCustomCategory: (t: "income" | "expense", c: string) => void;
};

export default function EditPage({
  type,
  amount,
  category,
  date,
  setType,
  setAmount,
  setCategory,
  setDate,
  addTransaction,
  transactions,
  initialBalance,
  setInitialBalance,
  deleteTransaction,
  customCategories,
  addCustomCategory,
}: EditPageProps) {
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Persistent state for set balance
  const [balanceSetIdx, setBalanceSetIdx] = useState(() => {
    const stored = localStorage.getItem("editPageBalanceSetIdx");
    return stored ? Number(stored) : 0;
  });
  const [balanceInput, setBalanceInput] = useState("");

  // Restore base balance on mount (if present)
  useEffect(() => {
    const storedBase = localStorage.getItem("editPageBaseBalance");
    if (storedBase !== null) setInitialBalance(Number(storedBase));
    // Don't overwrite if props already match
    // eslint-disable-next-line
  }, []);

  // Persist both base and set index whenever they change
  useEffect(() => {
    localStorage.setItem("editPageBaseBalance", String(initialBalance));
    localStorage.setItem("editPageBalanceSetIdx", String(balanceSetIdx));
  }, [initialBalance, balanceSetIdx]);

  // Compute categories for dropdown
  const categories =
    type === "income"
      ? [...defaultIncomeCategories, ...customCategories.income]
      : [...defaultExpenseCategories, ...customCategories.expense];

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    addCustomCategory(type, trimmed);
    setCategory(trimmed);
    setNewCategoryInput("");
  };

  // Only count transactions after "set" for balance calculation
  const futureTransactions = transactions.slice(balanceSetIdx);
  const futureIncome = futureTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const futureExpense = futureTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = initialBalance + futureIncome - futureExpense;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Set Current Balance widget */}
      <div className="bg-white rounded-xl shadow p-6 mb-2 max-w-md">
        <h2 className="text-lg font-medium text-gray-600 mb-2">
          Current Balance
        </h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            className="border rounded px-3 py-2 text-lg"
            placeholder="Set current balance"
          />
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              const val = parseFloat(balanceInput);
              if (!isNaN(val)) {
                setInitialBalance(val);
                setBalanceSetIdx(transactions.length);
                setBalanceInput("");
              }
            }}
          >
            Set
          </button>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">
          ${currentBalance.toFixed(2)}
        </div>
        {balanceSetIdx > 0 && (
          <div className="text-xs text-blue-500 mt-1">
            Balance set at transaction #{balanceSetIdx}
          </div>
        )}
      </div>

      {/* Edit Transactions Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Edit Transactions
      </h1>

      {/* Transactions Editable Table */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.id} className="border-b">
                <td className="px-3 py-2">
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    value={t.date}
                    onChange={() => {}} // editing stub if you want to support inline editing
                    readOnly
                  />
                </td>
                <td className="px-3 py-2 capitalize">{t.type}</td>
                <td className="px-3 py-2">{t.category}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-20"
                    value={t.amount}
                    onChange={() => {}} // editing stub
                    readOnly
                  />
                </td>
                <td className="px-3 py-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTransaction(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Categories */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-lg">
        <h2 className="text-lg font-medium text-gray-600 mb-2">
          Manage Categories
        </h2>
        <div className="flex gap-4 mb-2">
          {/* Type Selector */}
          <select
            className="border px-3 py-2 rounded w-[120px]"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "income" | "expense")
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {/* Category input */}
          <input
            type="text"
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            placeholder="Enter unique category"
            className="border px-3 py-2 rounded w-[220px]"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddCategory}
          >
            Save Category
          </motion.button>
        </div>
        <p className="text-xs text-gray-500">
          Avoid duplicates of default or existing categories.
        </p>
      </div>

      {/* Back Link */}
      <a href="/"
        className="text-blue-700 hover:underline"
      >← Back to Add Transaction</a>
    </div>
  );
}
