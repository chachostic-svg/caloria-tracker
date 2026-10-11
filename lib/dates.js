import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return format(new Date(y, m - 1, d), "d MMMM yyyy", { locale: ru });
}
