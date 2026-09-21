"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "Tableau de bord" },
  { href: "/portfolios", label: "Portefeuilles" },
  { href: "/allocation", label: "Allocation" },
  { href: "/benchmark", label: "Comparaison" },
  { href: "/notifications", label: "Notifications" },
  { href: "/settings", label: "Paramètres" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden sm:block w-[220px] shrink-0 border-r border-line bg-panel px-5 py-7">
      <div className="font-serif text-lg mb-8">Ledger</div>
      <nav>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-2.5 py-2 mb-0.5 rounded-[3px] text-sm ${
                active ? "bg-green-soft text-green font-medium" : "text-muted hover:bg-line/20"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 pt-5 border-t border-line text-xs">
        <div className="font-medium text-ink">{session?.user?.name ?? "…"}</div>
        <div className="text-muted">{session?.user?.email ?? ""}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 text-muted hover:text-ink underline underline-offset-2"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
