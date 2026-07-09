import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBookingPayload {
  serviceId: string;
  slotId: string;
  address: string;
  note?: string;
}

export interface IUpdateBookingStatusPayload {
  status: BookingStatus;
}