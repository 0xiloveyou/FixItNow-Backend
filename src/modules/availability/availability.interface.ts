import { AvailabilityStatus } from "../../../generated/prisma/enums";

export interface IAvailabilityPayload {
  date: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateAvailabilityPayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: AvailabilityStatus;
}