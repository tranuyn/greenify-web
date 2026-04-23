export function normalizeLockAtForApi(lockAt: string): string {
  const raw = lockAt.trim();

  // Expected exact backend format: yyyy-MM-dd'T'HH:mm:ss
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(raw)) {
    return raw;
  }

  // datetime-local usually returns yyyy-MM-dd'T'HH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
    return `${raw}:00`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const yyyy = parsed.getFullYear();
  const mm = pad2(parsed.getMonth() + 1);
  const dd = pad2(parsed.getDate());
  const hh = pad2(parsed.getHours());
  const mi = pad2(parsed.getMinutes());
  const ss = pad2(parsed.getSeconds());

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}
