import { DoorConfigurator } from "@/components/door/door-configurator";
import { MobileShell } from "@/components/layout/mobile-shell";

export default function Home() {
  return (
    <MobileShell>
      <DoorConfigurator />
    </MobileShell>
  );
}
