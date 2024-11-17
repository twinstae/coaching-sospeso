import { toast } from "react-toastify";
export { ToastContainer as ToastifyToastContainer } from "react-toastify";

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
} as const;

const Toast = ({
  text,
}: {
  text: string;
  type?: keyof typeof alertVariantDict;
}) => {
  return (
    <div role="alert">
      <span>{text}</span>
    </div>
  );
};

export const toastifyToastApi: ToastApiI = {
  toast: (text, type = "info") => {
    return toast(<Toast text={text} type={type} />, {
      className: `alert ${alertVariantDict[type]}`,
    });
  },
};
