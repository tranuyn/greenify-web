/**
 * Định dạng khối lượng CO2 (kg hoặc t)
 */
export const formatCo2 = (kg: number): string => {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toFixed(2)} kg`;
};

/**
 * Định dạng ngày ISO sang vi-VN
 */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

/**
 * Định dạng độ tin cậy AI
 */
export const formatConfidence = (score: number): string =>
  `${Math.round(score * 100)}%`;
