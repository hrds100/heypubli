import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeyPubli | Para Marcas",
  description:
    "Alcance micro-influenciadores autênticos no Brasil. Publicação automática, comissão por performance.",
};

export default function ParaMarcasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
