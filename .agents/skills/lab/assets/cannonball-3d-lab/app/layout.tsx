import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cannonball 3D Lab",
  description: "Laboratório local para inspecionar geometria, materiais, HDR e custo de cenas 3D.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
