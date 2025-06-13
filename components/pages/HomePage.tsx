// components/pages/HomePage.tsx
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#FBBF24", // amber
  "#EF4444", // red
  "#6366F1", // indigo
  "#EC4899", // pink
];

const timeframes = [
  { label: "Last Month", value: 30 },
  { label: "Last 3 Months", value: 90 },
  { label: "Last Year", value: 365 },
  { label: "All", value: Infinity },
];

type Transaction = {
  id: string | number;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
};

type HomePageProps = {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
};

export default function HomePage({
  income,
  fixedExpenses,
  variableExpenses,
  expenses,
  balance,
  transactions,
}: HomePageProps) {
  const [selectedRange, setSelectedRange] = useState(30);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const now = new Date();
    const filtered = transactions.filter((t) => {
      if (selectedRange === Infinity) return true;
      const transactionDate = new Date(t.date);
      const diff = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= selectedRange;
    });
    setFilteredTransactions(filtered);
  }, [selectedRange, transactions]);

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
        >
          {timeframes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition-transform">
          <h2 className="text-lg font-medium text-gray-600">Balance</h2>
          <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition-transform">
          <h2 className="text-lg font-medium text-gray-600">Income</h2>
          <p className="text-3xl font-bold text-blue-500">${income.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition-transform">
          <h2 className="text-lg font-medium text-gray-600">Expenses</h2>
          <p className="text-3xl font-bold text-red-500">${expenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Spending by Category</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500">
            No expense data available for this timeframe.
          </p>
        )}
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Recent Transactions</h2>
        <ul className="divide-y divide-gray-200">
          {recentTransactions.map((t) => (
            <li key={t.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">{t.category}</p>
                <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <p
                className={`font-medium ${
                  t.type === "income" ? "text-green-600" : "text-red-500"
                }`}
              >
                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
