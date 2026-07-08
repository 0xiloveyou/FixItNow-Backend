export interface TechnicianProfilePayload {
  bio?: string;
  experience: number;
  location: string;
  hourlyRate: number;
}

export interface TechnicianProfileUpdatePayload {
  bio?: string;
  experience?: number;
  location?: string;
  hourlyRate?: number;
}