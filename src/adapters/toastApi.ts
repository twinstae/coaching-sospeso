import { toast } from "react-toastify";
export { ToastContainer as Toaster } from "react-toastify";

export type ToastApiI = {
  toast: (
    text: string,
    type?: "info" | "success" | "warning" | "error",
  ) => void;
};

const alertVariantDict = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

export const toastApi: ToastApiI = {
  toast: (text, type = "info") => {
    return toast(text, { className: `alert ${alertVariantDict[type]}` });
  },
};
