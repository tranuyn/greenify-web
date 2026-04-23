import { z } from "zod";
import { normalizeLockAtForApi } from "@/common/utils/date-time";
import type { CreateLeaderboardPrizeRequest } from "@/types/gamification.types";

type TFunction = (key: any, options?: any) => string;

const getCreatePrizeMessages = (t: TFunction) => ({
  weekStartDateRequired: t(
    "admin.leaderboard.form.validation.weekStartDateRequired",
  ),
  weekStartDateInvalid: t(
    "admin.leaderboard.form.validation.weekStartDateInvalid",
  ),
  lockAtRequired: t("admin.leaderboard.form.validation.lockAtRequired"),
  lockAtInvalid: t("admin.leaderboard.form.validation.lockAtInvalid"),
  nationalVoucherRequired: t(
    "admin.leaderboard.form.validation.nationalVoucherRequired",
  ),
  provincialVoucherRequired: t(
    "admin.leaderboard.form.validation.provincialVoucherRequired",
  ),
  // THÊM 2 MESSAGES MỚI
  weekStartNotMonday: t("admin.leaderboard.form.validation.weekStartNotMonday"),
  lockAtOutOfRange: t("admin.leaderboard.form.validation.lockAtOutOfRange"),
});

export const createLeaderboardPrizeSchema = (t: TFunction) => {
  const messages = getCreatePrizeMessages(t);

  return z
    .object({
      weekStartDate: z
        .string()
        .min(1, messages.weekStartDateRequired)
        .regex(/^\d{4}-\d{2}-\d{2}$/, messages.weekStartDateInvalid),
      lockAt: z
        .string()
        .min(1, messages.lockAtRequired)
        .transform(normalizeLockAtForApi)
        .refine(
          (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value),
          messages.lockAtInvalid,
        ),
      nationalVoucherTemplateId: z
        .string()
        .min(1, messages.nationalVoucherRequired),
      provincialVoucherTemplateId: z
        .string()
        .min(1, messages.provincialVoucherRequired),
    })
    .superRefine((data, ctx) => {
      // Logic kiểm tra chéo
      if (data.weekStartDate) {
        const startDate = new Date(data.weekStartDate);

        // 1. Kiểm tra phải là Thứ 2 (0 là Chủ nhật, 1 là Thứ 2)
        if (startDate.getDay() !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.weekStartNotMonday,
            path: ["weekStartDate"],
          });
        }

        if (data.lockAt) {
          const lockDate = new Date(data.lockAt);

          if (!isNaN(lockDate.getTime()) && !isNaN(startDate.getTime())) {
            const minTime = startDate.getTime(); // 00:00:00 Thứ 2
            const maxTime = minTime + 7 * 24 * 60 * 60 * 1000; // 00:00:00 Thứ 2 tuần sau

            // lockAt phải >= Thứ 2 và < Thứ 2 tuần kế tiếp
            if (lockDate.getTime() < minTime || lockDate.getTime() >= maxTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: messages.lockAtOutOfRange,
                path: ["lockAt"],
              });
            }
          }
        }
      }
    }) satisfies z.ZodType<CreateLeaderboardPrizeRequest>;
};

export type CreateLeaderboardPrizeFormData = z.infer<
  ReturnType<typeof createLeaderboardPrizeSchema>
>;
