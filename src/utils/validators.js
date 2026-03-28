import { z } from 'zod';

export const sosReportSchema = z.object({
  chirpID: z.string().min(1, "chirpID is required"),
  rawText: z.string().min(1, "rawText is required"),
  location: z.object({
    coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]"),
  }).optional(),
  metadata: z.any().optional(),
});
