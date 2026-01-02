"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * ボトムナビゲーション
 */
export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "ホーム", icon: "🏠" },
    { href: "/meds", label: "お薬", icon: "💊" },
    { href: "/history", label: "履歴", icon: "📅" },
    { href: "/settings", label: "設定", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex flex-col items-center justify-center
                min-h-[72px] flex-1
                text-lg font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-3xl mb-1">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
