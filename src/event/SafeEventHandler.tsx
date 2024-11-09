import type { ReactNode } from "react";
import type { SafeEventBus } from "@/event/SafeEventBus";

export function SafeEventHandler<DetailT>({
  bus,
  onEvent,
  children,
}: {
  bus: SafeEventBus<DetailT>;
  onEvent: (detail: DetailT) => void | Promise<void>;
  children: ReactNode | ReactNode[];
}) {
  return (
    <div
      ref={(element) => {
        if (element) {
          bus.on(element, onEvent);
        }
      }}
    >
      {children}
    </div>
  );
}
