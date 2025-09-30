export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}

export function formatCurrency(
  amount: number | string | undefined,
  currency: string = "VND",
  locale: string = "vi-VN"
) {
  if (amount === undefined || amount === null) return "0 ₫";

  try {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(numAmount);
  } catch (_err) {
    return "0 ₫";
  }
}
