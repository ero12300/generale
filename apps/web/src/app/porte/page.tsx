import type { Metadata } from "next";
import { DoorConfigurator } from "@/components/doors/door-configurator";

export const metadata: Metadata = {
  title: "Configuratore Porte",
  description: "Calcolo mobile-first di porte da vano muro a scheda produzione",
};

export default function DoorsPage() {
  return <DoorConfigurator />;
}
