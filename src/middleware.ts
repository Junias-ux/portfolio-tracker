export { default } from "next-auth/middleware";

// Toutes les pages internes exigent une session valide.
// /login, /register, /api/auth/*, les assets statiques et le favicon
// restent accessibles sans authentification.
export const config = {
  matcher: [
    "/",
    "/portfolios/:path*",
    "/allocation/:path*",
    "/benchmark/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};
