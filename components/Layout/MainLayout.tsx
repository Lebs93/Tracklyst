import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Your navigation items
const navItems = [
  { href: "/home", label: "Home", icon: "/icons/home.svg" },
  { href: "/add", label: "Add Transaction", icon: "/icons/add.svg" },
  { href: "/edit", label: "Edit Transactions", icon: "/icons/edit.svg" },
  { href: "/investing", label: "Investing", icon: "/icons/chart.svg" },
  { href: "/goals", label: "Goals", icon: "/icons/target.svg" },
  { href: "/profile", label: "Profile", icon: "/icons/profile.svg" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Hamburger (mobile only) */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M4 7h20M4 14h20M4 21h20" />
        </svg>
      </button>

      {/* Sidebar - slides in on mobile, always visible on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transform
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-56 md:flex
        `}
        style={{ minWidth: "220px" }}
      >
        {/* Close button (mobile only) */}
        <div className="flex items-center justify-between h-16 px-4 border-0 border-gray-200 ">
          <img src="/logo-icon.png" alt="Tracklyst circular logo icon with stylized upward arrow, part of sidebar navigation in a finance app" className="h-12 w-auto mr-0" />
          <img src="/logo-wordmark.png" alt="Tracklyst wordmark in modern font, displayed next to the logo icon in the sidebar header, representing the finance app brand" className="h-14 w-auto ml-[-2]" />
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={`flex items-center px-4 py-2 mb-2 rounded-lg text-gray-700 hover:bg-gray-100 transition
                ${router.pathname === item.href ? "bg-gray-200 font-semibold" : ""}
              `}
              onClick={() => setSidebarOpen(false)} // close sidebar on mobile after nav
            >
              <img src={item.icon} alt="" className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8" style={{ minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
