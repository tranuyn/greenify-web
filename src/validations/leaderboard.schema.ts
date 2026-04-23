import { z } from "zod";
import { normalizeLockAtForApi } from "@/common/utils/date-time";
import type { CreateLeaderboardPrizeRequest } from "@/types/gamification.types";

type TFunction = (key: any, options?: any) => string;

const getCreatePrizeMessages = (t: TFunction) => ({
  weekStartDateRequired: t("admin.leaderboard.form.validation.weekStartDateRequired"),
  weekStartDateInvalid: t("admin.leaderboard.form.validation.weekStartDateInvalid"),
  lockAtRequired: t("admin.leaderboard.form.validation.lockAtRequired"),
  lockAtInvalid: t("admin.leaderboard.form.validation.lockAtInvalid"),
  nationalVoucherRequired: t(
    "admin.leaderboard.form.validation.nationalVoucherRequired",
  ),
  provincialVoucherRequired: t(
    "admin.leaderboard.form.validation.provincialVoucherRequired",
  ),
});

export const createLeaderboardPrizeSchema = (t: TFunction) => {
  const messages = getCreatePrizeMessages(t);

  return z.object({
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
    nationalVoucherTemplateId: z.string().min(1, messages.nationalVoucherRequired),
    provincialVoucherTemplateId: z
      .string()
      .min(1, messages.provincialVoucherRequired),
  }) satisfies z.ZodType<CreateLeaderboardPrizeRequest>;
};

export type CreateLeaderboardPrizeFormData = z.infer<
  ReturnType<typeof createLeaderboardPrizeSchema>
>;
