export function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale);
}

export function formatDateTime(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
