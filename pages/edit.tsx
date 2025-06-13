import { useState, useEffect, useMemo, useCallback } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const DEFAULT_INCOME_CATEGORIES = ["Paycheck", "Freelance Gig", "Gift"];
const DEFAULT_EXPENSE_CATEGORIES = ["Need", "Want"];

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

const EditPage: NextPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategories>({
    income: [],
    expense: [],
  });

  // Set Current Balance Logic
  const [initialBalance, setInitialBalance] = useState(0);
  const [balanceSetIdx, setBalanceSetIdx] = useState(0);
  const [balanceInput, setBalanceInput] = useState("");

  // Form state for creating new categories
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">(
    "income"
  );
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load data on mount
  useEffect(() => {
    const tx = localStorage.getItem("transactions");
    if (tx) setTransactions(JSON.parse(tx));

    const cats = localStorage.getItem("customCategories");
    if (cats) setCustomCategories(JSON.parse(cats));

    // Balance stuff
    const storedBalance = localStorage.getItem("editPageBaseBalance");
    const storedIdx = localStorage.getItem("editPageBalanceSetIdx");
    if (storedBalance !== null) setInitialBalance(Number(storedBalance));
    if (storedIdx !== null) setBalanceSetIdx(Number(storedIdx));
  }, []);

  // Persist updates
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(customCategories));
  }, [customCategories]);
  useEffect(() => {
    localStorage.setItem("editPageBaseBalance", String(initialBalance));
    localStorage.setItem("editPageBalanceSetIdx", String(balanceSetIdx));
  }, [initialBalance, balanceSetIdx]);

  // Update a single field of a transaction
  const updateTransaction = useCallback(
    <K extends keyof Omit<Transaction, "id">>(
      id: number,
      field: K,
      value: Transaction[K]
    ) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
    },
    []
  );

  // Delete with confirmation
  const deleteTransaction = useCallback((id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  // Available categories for a given type
  const getCategories = (type: "income" | "expense") =>
    type === "income"
      ? [...DEFAULT_INCOME_CATEGORIES, ...customCategories.income]
      : [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories.expense];

  // Add a new custom category
  const addCategory = useCallback(() => {
    const name = newCategoryName.trim();
    if (!name) return alert("Category name cannot be blank.");
    const list = customCategories[newCategoryType];
    const defaults =
      newCategoryType === "income"
        ? DEFAULT_INCOME_CATEGORIES
        : DEFAULT_EXPENSE_CATEGORIES;
    if (list.includes(name) || defaults.includes(name)) {
      return alert("That category already exists.");
    }
    setCustomCategories((prev) => ({
      ...prev,
      [newCategoryType]: [...prev[newCategoryType], name],
    }));
    setNewCategoryName("");
  }, [newCategoryName, newCategoryType, customCategories]);

  // Current Balance Calculation
  const futureTransactions = transactions.slice(balanceSetIdx);
  const futureIncome = futureTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const futureExpense = futureTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = initialBalance + futureIncome - futureExpense;

  return (
    <>
      <Head>
        <title>Edit Transactions • Finance App</title>
      </Head>

      <main className="max-w-3xl mx-auto p-4">
        {/* Smooth, horizontal Set Current Balance Bar */}
        <div className="flex items-center bg-white shadow rounded-xl px-6 py-4 mb-8 gap-6 max-w-2xl mx-auto">
          <span className="text-lg font-medium text-gray-600">Current Balance</span>
          <input
            type="number"
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            className="flex-1 border rounded px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150"
            placeholder="Set current balance"
            style={{ maxWidth: 220 }}
          />
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
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
          <span className="ml-6 text-2xl font-bold text-gray-900 min-w-[90px] text-right">
            ${currentBalance.toFixed(2)}
          </span>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Edit Transactions</h1>

        {transactions.length === 0 ? (
          <p className="mb-4">
            No transactions yet.{" "}
            <Link href="/" className="text-blue-600 underline">
              Add one here
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const categories = getCategories(tx.type);
                  // Validation states
                  const isAmountValid = !isNaN(tx.amount) && tx.amount >= 0;
                  return (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={tx.date}
                          onChange={(e) =>
                            updateTransaction(tx.id, "date", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-full"
                          aria-label="Date"
                          required
                        />
                      </td>
                      <td className="px-3 py-2 capitalize">{tx.type}</td>
                      <td className="px-3 py-2">
                        <select
                          value={tx.category}
                          onChange={(e) =>
                            updateTransaction(
                              tx.id,
                              "category",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                          aria-label="Category"
                          required
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={tx.amount}
                          onChange={(e) =>
                            updateTransaction(
                              tx.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={`border rounded px-2 py-1 w-full text-right ${
                            isAmountValid ? "" : "border-red-500"
                          }`}
                          aria-label="Amount"
                          required
                        />
                        {!isAmountValid && (
                          <p className="text-xs text-red-600 mt-1">
                            Invalid amount
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete transaction"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Categories */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-3">Manage Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="cat-type" className="block text-sm">
                Type
              </label>
              <select
                id="cat-type"
                value={newCategoryType}
                onChange={(e) =>
                  setNewCategoryType(e.target.value as "income" | "expense")
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="cat-name" className="block text-sm">
                New Category Name
              </label>
              <input
                id="cat-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1"
                placeholder="Enter unique category"
                aria-describedby="cat-help"
              />
              <p id="cat-help" className="text-xs text-gray-500 mt-1">
                Avoid duplicates of default or existing categories.
              </p>
            </div>
          </div>
          <button
            onClick={addCategory}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!newCategoryName.trim()}
          >
            Save Category
          </button>
        </section>

        <div className="mt-6">
          <Link
            href="/"
            className="text-blue-600 underline"
            aria-label="Go back to Add page"
          >
            ← Back to Add Transaction
          </Link>
        </div>
      </main>
    </>
  );
};

export default EditPage;
