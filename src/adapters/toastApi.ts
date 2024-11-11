import { toast } from "react-toastify";
export { ToastContainer as Toaster } from "react-toastify";

export type ToastApiI = {
  toast: (
    text: string,
    type?: "info" | "success" | "warning" | "error",
  ) => void;
};

export const toastApi: ToastApiI = {
  toast: (text, type = "info") => {
    return toast(text, { className: `alert alert-${type}` });
  },
};
