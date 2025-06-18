// components/Sidebar.tsx
import Link from 'next/link';

const navItems = [
  { label: 'Home',            href: '/home',      icon: '/icons/home.svg' },
  { label: 'Add Transaction', href: '/add',       icon: '/icons/add.svg' },
  { label: 'Investing',       href: '/investing', icon: '/icons/chart.svg' },
  { label: 'Goals',           href: '/goals',     icon: '/icons/target.svg' },
  { label: 'Profile',         href: '/profile',   icon: '/icons/profile.svg' },
];

export default function Sidebar() {
  return (
    <aside className="bg-white w-64 flex flex-col p-6 space-y-8 text-gray-900 border-r border-gray-200 shadow-sm">
      {/* Large, close logos */}
      <div className="flex items-center space-x-1 mb-8">
        <img
          src="/logo-icon.png"
          alt="Tracklyst Icon"
          className="h-14 w-auto"
          style={{ marginBottom: '2px' }}
        />
        <img
          src="/logo-wordmark.png"
          alt="Tracklyst Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map(({ label, href, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition"
              >
                <img
                  src={icon}
                  alt={label}
                  className="h-5 w-5"
                  style={{ filter: 'invert(0.5) grayscale(1) opacity(0.8)' }}
                />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
