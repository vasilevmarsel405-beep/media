import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hubPageMeta } from "@/lib/copy";

export const metadata: Metadata = {
  title: { absolute: hubPageMeta.kabinet.title },
  description: hubPageMeta.kabinet.description,
};

export default function KabinetLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
