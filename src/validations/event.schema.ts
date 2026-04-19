import { z } from 'zod';
import type { CreateEventRequest } from 'types/community.types';

type TFunction = (key: any, options?: any) => string;
const getCreateEventMessages = (t: TFunction) => ({
  title: t('events.create_event.validation.title'),
  description: t('events.create_event.validation.description'),
  eventType: t('events.create_event.validation.event_type'),
  city: t('events.create_event.validation.city'),
  locationAddress: t('events.create_event.validation.location_address'),
  startDate: t('events.create_event.validation.start_date'),
  startTime: t('events.create_event.validation.start_time'),
  endDate: t('events.create_event.validation.end_date'),
  endTime: t('events.create_event.validation.end_time'),
  rewardPointsRequired: t('events.create_event.validation.reward_points_required'),
  rewardPointsPositive: t('events.create_event.validation.reward_points_positive'),
  acceptedTerms: t('events.create_event.validation.accepted_terms'),
  coverImageUrl: t('events.create_event.validation.cover_image_url'),
  latitude: t('events.create_event.validation.latitude'),
  longitude: t('events.create_event.validation.longitude'),
  maxParticipants: t('events.create_event.validation.max_participants'),
  participationConditions: t('events.create_event.validation.participation_conditions'),
  cancelDeadlineDays: t('events.create_event.validation.cancel_deadline_days'),
});

export const createEventSchema = (t: TFunction) => {
  const messages = getCreateEventMessages(t);

  return z.object({
    title: z.string().min(1, messages.title),
    description: z.string().min(1, messages.description),
    eventType: z.string().min(1, messages.eventType),
    coverImageUrl: z.string().nullable().optional(),
    city: z.string().min(1, messages.city),
    locationAddress: z.string().min(1, messages.locationAddress),
    startDate: z.date({ message: messages.startDate }),
    startTime: z.string().min(1, messages.startTime),
    endDate: z.date({ message: messages.endDate }),
    endTime: z.string().min(1, messages.endTime),
    rewardPoints: z
      .string()
      .min(1, messages.rewardPointsRequired)
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, messages.rewardPointsPositive),
    acceptedTerms: z.boolean().refine((v) => v === true, {
      message: messages.acceptedTerms,
    }),
  });
};

export type CreateEventFormData = z.infer<ReturnType<typeof createEventSchema>>;

export const createEventRequestSchema = (t: TFunction): z.ZodType<CreateEventRequest> => {
  const messages = getCreateEventMessages(t);

  return z.object({
    title: z.string().min(1, messages.title),
    description: z.string().min(1, messages.description),
    eventType: z.enum(["CLEANUP", "PLANTING", "RECYCLING", "EDUCATION", "OTHER"]),
    startTime: z.string().min(1, messages.startTime),
    endTime: z.string().min(1, messages.endTime),
    maxParticipants: z.number().int().positive(messages.maxParticipants),
    minParticipants: z.number().int().nonnegative(),
    cancelDeadlineHoursBefore: z.number().int().nonnegative(messages.cancelDeadlineDays),
    signUpDeadlineHoursBefore: z.number().int().nonnegative(),
    reminderHoursBefore: z.number().int().nonnegative(),
    thankYouHoursAfter: z.number().int().nonnegative(),
    rewardPoints: z.number().int().positive(messages.rewardPointsPositive),
    status: z.enum([
      "DRAFT",
      "PENDING_APPROVAL",
      "APPROVED",
      "REJECTED",
      "NEEDS_REVISION",
      "PUBLISHED",
      "CLOSED",
      "CANCELLED",
    ]),
    thumbnail: z.object({
      bucketName: z.string().optional(),
      objectKey: z.string().optional(),
      imageUrl: z.string(),
    }),
    images: z.array(z.object({
      bucketName: z.string().optional(),
      objectKey: z.string().optional(),
      imageUrl: z.string(),
    })),
    address: z.object({
      province: z.string().min(1, messages.city),
      ward: z.string(),
      addressDetail: z.string().min(1, messages.locationAddress),
      latitude: z.number().finite(messages.latitude),
      longitude: z.number().finite(messages.longitude),
    }),
  });
};

type RequestSchemaOutput = z.infer<ReturnType<typeof createEventRequestSchema>>;
type IsCreateEventRequestMatched = RequestSchemaOutput extends CreateEventRequest
  ? CreateEventRequest extends RequestSchemaOutput
  ? true
  : false
  : false;
export type CreateEventRequestSchemaMatches = IsCreateEventRequestMatched;

export const EVENT_TYPE_OPTIONS = [
  { value: 'Dọn rác', labelKey: 'events.create_event.event_types.cleanup' },
  { value: 'Trồng cây', labelKey: 'events.create_event.event_types.tree_planting' },
  { value: 'Workshop', labelKey: 'events.create_event.event_types.workshop' },
  { value: 'Chiến dịch', labelKey: 'events.create_event.event_types.campaign' },
  { value: 'Khác', labelKey: 'events.create_event.event_types.other' },
] as const;

export const GENDER_OPTIONS: { label: string; value: 'Nam' | 'Nữ' | 'Không' }[] = [
  { label: 'Không yêu cầu', value: 'Không' },
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
];
