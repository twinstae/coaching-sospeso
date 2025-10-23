import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import { ToastifyToastContainer } from "@/adapters/toastApi";

export function renderTL(ui: ReactNode) {
  return render(ui, {
    wrapper: ({ children }) => (
      <>
        {children}
        <ToastifyToastContainer />
      </>
    ),
  });
}
