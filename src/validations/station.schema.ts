import { z } from "zod";

export const createStationSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t("Tên điểm thu gom không được để trống.")),
    description: z.string(),

    // Check SĐT Việt Nam cơ bản (10 chữ số, bắt đầu bằng số 0)
    phoneNumber: z
      .string()
      .min(1, t("Vui lòng nhập số điện thoại."))
      .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, t("Số điện thoại không hợp lệ.")),

    email: z
      .string()
      .min(1, t("Vui lòng nhập email."))
      .email(t("Định dạng email không hợp lệ.")),

    address: z.object({
      province: z.string().min(1, t("Vui lòng nhập Tỉnh/Thành phố.")),
      ward: z.string().min(1, t("Vui lòng nhập Phường/Xã.")),
      addressDetail: z.string().min(1, t("Vui lòng nhập địa chỉ chi tiết.")),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),

    wasteTypeIds: z
      .array(z.string())
      .min(1, t("Vui lòng chọn ít nhất một loại rác.")),

    openTimes: z
      .array(
        z.object({
          startTime: z.string().min(1),
          endTime: z.string().min(1),
          dayOfWeek: z.enum([
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ]),
        }),
      )
      .min(1, t("Vui lòng thêm ít nhất một khung giờ hoạt động.")),
  });
};

export type StationFormSchemaData = z.infer<
  ReturnType<typeof createStationSchema>
>;
