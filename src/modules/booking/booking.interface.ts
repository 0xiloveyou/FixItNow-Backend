export interface IBookingPayload {
  serviceId: string;
  slotId: string;
  address: string;
  note?: string;
}