import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Ledger — Gestion de portefeuille",
  description: "Le patrimoine, tenu à jour.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
