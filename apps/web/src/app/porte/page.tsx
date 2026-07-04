import type { Metadata } from "next";
import { Configuratore } from "@/components/porte/configuratore";

export const metadata: Metadata = {
  title: "Configuratore Porte | Deal Desk",
  description: "Calcola le dimensioni di produzione per porte interne a battente",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function PortePage() {
  return <Configuratore />;
}
