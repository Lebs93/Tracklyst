// pages/home.tsx

import { useEffect, useState, useMemo, useCallback } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
} from "recharts";

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

const INCOME_COLORS = ["#22c55e", "#10b981", "#059669", "#047857", "#34d399"];
const EXPENSE_COLORS = ["#ef4444", "#f87171", "#dc2626", "#b91c1c", "#fca5a5"];

const RANGE_OPTIONS = [
  "All Time",
  "This Month",
  "Last 30 Days",
  "Last 90 Days",
  "Last 3 Months",
  "Last 365 Days",
  "This Year",
  "Custom Range",
] as const;

type RangeOption = typeof RANGE_OPTIONS[number];

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [range, setRange] = useState<RangeOption>("All Time");
  const [customStart, setCustomStart] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [customEnd, setCustomEnd] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // load once
  useEffect(() => {
    const tx = localStorage.getItem("transactions");
    if (tx) setTransactions(JSON.parse(tx));
  }, []);

  // determine filter dates
  const [startDate, endDate] = useMemo(() => {
    const now = new Date();
    let start: Date, end = new Date(now);
    switch (range) {
      case "This Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "Last 30 Days":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "Last 90 Days":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 Months":
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "Last 365 Days":
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "This Year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "Custom Range":
        start = new Date(customStart);
        end = new Date(customEnd);
        break;
      default:
        start = new Date(0);
    }
    return [start, end];
  }, [range, customStart, customEnd]);

  // filtered transactions
  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= startDate && d <= endDate;
      }),
    [transactions, startDate, endDate]
  );

  // totals
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0,
      exp = 0;
    for (const t of filtered) {
      if (t.type === "income") inc += t.amount;
      else exp += t.amount;
    }
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [filtered]);

  // aggregate by category
  const aggregate = useCallback(
    (type: "income" | "expense") =>
      Object.entries(
        filtered
          .filter((t) => t.type === type)
          .reduce<Record<string, number>>((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {})
      ).map(([category, value]) => ({ category, value })),
    [filtered]
  );

  const incomeData = useMemo(() => aggregate("income"), [aggregate]);
  const expenseData = useMemo(() => aggregate("expense"), [aggregate]);

  // recent
  const recent = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [filtered]
  );

  // custom label renderer to place text outside
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RAD = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RAD);
    const y = cy + radius * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fill="#4a5568"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <Head>
        <title>Dashboard • Finance App</title>
      </Head>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="flex items-center space-x-2">
            <span className="font-medium">Date Range:</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeOption)}
              className="border rounded px-3 py-1"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          {range === "Custom Range" && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <span>to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
          )}
        </div>

        {/* Summary Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Income</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              ${totalExpense.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Pie Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Income */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Income by Category</h2>
            {incomeData.length === 0 ? (
              <p className="text-gray-500">No income data.</p>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderLabel}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {incomeData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={INCOME_COLORS[i % INCOME_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(v: number, name: string) => [
                        `$${v.toFixed(2)}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/** Expenses */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Expenses by Category</h2>
            {expenseData.length === 0 ? (
              <p className="text-gray-500">No expense data.</p>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderLabel}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {expenseData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(v: number, name: string) => [
                        `$${v.toFixed(2)}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Recent Transactions</h2>
          {recent.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul role="list" className="divide-y">
              {recent.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between items-center py-2"
                >
                  <span>{new Date(tx.date).toLocaleDateString()}</span>
                  <span
                    className={
                      tx.type === "income"
                        ? "text-blue-600"
                        : "text-red-600"
                    }
                  >
                    {tx.type === "income" ? "+" : "-"}$
                    {tx.amount.toFixed(2)}
                  </span>
                  <span>{tx.category}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
