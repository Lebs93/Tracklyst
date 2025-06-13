// components/FinanceTracker.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// --- Types --------------------------------------------------
export type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

export type CustomCategories = {
  income: string[];
  expense: string[];
};

export interface FinanceContextType {
  transactions: Transaction[];
  initialBalance: number;
  customCategories: CustomCategories;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: number) => void;
  updateTransaction: <K extends keyof Omit<Transaction, "id">>(
    id: number,
    field: K,
    value: Transaction[K]
  ) => void;
  addCustomCategory: (type: "income" | "expense", name: string) => void;
}

// --- Context ------------------------------------------------
const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = (): FinanceContextType => {
  const ctx = React.useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return ctx;
};

// --- Provider ------------------------------------------------
interface ProviderProps {
  children: ReactNode;
}

export const FinanceProvider = ({ children }: ProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [customCategories, setCustomCategories] = useState<CustomCategories>({
    income: [],
    expense: [],
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const tx = localStorage.getItem("transactions");
      if (tx) setTransactions(JSON.parse(tx));

      const bal = localStorage.getItem("initialBalance");
      if (bal) setInitialBalance(parseFloat(bal));

      const cats = localStorage.getItem("customCategories");
      if (cats) setCustomCategories(JSON.parse(cats));
    } catch (err) {
      console.error("Failed to load finance data:", err);
    }
  }, []);

  // Persist on changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("initialBalance", initialBalance.toString());
  }, [initialBalance]);

  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(customCategories));
  }, [customCategories]);

  // Add a new transaction
  const addTransaction = useCallback(
    (tx: Omit<Transaction, "id">) => {
      if (isNaN(tx.amount) || tx.amount <= 0) return;
      const newTx: Transaction = { id: Date.now(), ...tx };
      setTransactions((prev) => [newTx, ...prev]);
    },
    []
  );

  // Delete by id, with confirmation
  const deleteTransaction = useCallback((id: number) => {
    if (confirm("Delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  // Update a single field
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

  // Add a new custom category
  const addCustomCategory = useCallback(
    (type: "income" | "expense", name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCustomCategories((prev) => ({
        ...prev,
        [type]: [...prev[type], trimmed],
      }));
    },
    []
  );

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        initialBalance,
        customCategories,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addCustomCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
