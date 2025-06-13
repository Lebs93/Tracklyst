import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/home",       label: "Home",               icon: "/icons/home.svg" },
  { href: "/",           label: "Add Transaction",    icon: "/icons/add.svg" },
  { href: "/edit",       label: "Edit Transactions",  icon: "/icons/edit.svg" },
  { href: "/investing",  label: "Investing",          icon: "/icons/chart.svg" },
  { href: "/goals",      label: "Goals",              icon: "/icons/target.svg" },
  { href: "/profile",    label: "Profile",            icon: "/icons/profile.svg" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex flex-col w-20 md:w-56 p-2 bg-sidebar text-white">
        <div className="h-16 flex items-center justify-center mb-4 border-b border-white/20">
          <img
            src="/logo-wordmark.svg"
            alt="Tracklyst"
            className="hidden md:block h-6"
          />
          <img src="/logo-icon.svg" alt="T" className="md:hidden h-6" />
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map(({ href, label, icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                  ${active
                    ? "bg-white/25 text-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <img src={icon} alt={label} className="w-6 h-6 fill-current" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-neutral-light">
        <div className="card mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
