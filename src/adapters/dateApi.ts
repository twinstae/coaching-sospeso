import { format } from "date-fns/format";
export { addHours } from "date-fns/addHours";

export function formatyyyyMMddHH(date: Date) {
  return format(date, "yyyyMMddHH");
}

export function format년월일(date: Date) {
  return format(date, "yyyy년 M월 d일");
}
