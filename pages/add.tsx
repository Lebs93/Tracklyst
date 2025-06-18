import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const DEFAULT_INCOME_CATEGORIES = ["Paycheck", "Freelance Gig", "Gift"];
const DEFAULT_EXPENSE_CATEGORIES = ["Need", "Want"];

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

export default function AddTransactionPage() {
  const router = useRouter();

  // Form state
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  // Persisted
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<{
    income: string[];
    expense: string[];
  }>({ income: [], expense: [] });

  // Load on mount
  useEffect(() => {
    const savedTx = localStorage.getItem("transactions");
    if (savedTx) setTransactions(JSON.parse(savedTx));

    const savedCats = localStorage.getItem("customCategories");
    if (savedCats) setCustomCategories(JSON.parse(savedCats));
  }, []);

  // Build category list
  const availableCategories = [
    ...(type === "income" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES),
    ...(customCategories[type] || []),
  ];

  // Ensure we have a valid category
  useEffect(() => {
    if (!availableCategories.includes(category) && availableCategories.length) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  // Validation
  const isValid =
    !!amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0 &&
    !!date &&
    !!category;

  // Submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;
      const newTx: Transaction = {
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        category,
        date,
      };
      const updated = [newTx, ...transactions];
      localStorage.setItem("transactions", JSON.stringify(updated));
      setTransactions(updated);
      setAmount("");
      router.replace("/add"); // Stay on add page after submission
    },
    [amount, category, date, isValid, router, transactions, type]
  );

  return (
    <>
      <Head>
        <title>Add Transaction • Finance App</title>
      </Head>
      <main className="max-w-lg mx-auto p-4 relative">
        {/* EDIT TRANSACTIONS BUTTON */}
        <button
          onClick={() => router.push('/edit')}
          className="absolute right-0 top-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          style={{ margin: '1rem' }}
        >
          Edit Transactions
        </button>
        <h1 className="text-2xl font-semibold mb-6">Add Transaction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
            {(!amount || isNaN(Number(amount)) || Number(amount) <= 0) && (
              <p className="mt-1 text-xs text-red-600">
                Enter a number greater than 0
              </p>
            )}
          </div>
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 rounded text-white transition ${
              isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
            }`}
          >
            Add Transaction
          </button>
        </form>
      </main>
    </>
  );
}
