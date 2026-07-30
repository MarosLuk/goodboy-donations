import { z } from 'zod';

export const apiMessageSchema = z.object({
  type: z.enum(['ERROR', 'WARNING', 'INFO', 'SUCCESS']),
  message: z.string(),
  // Not in the spec, but the server sends it on validation errors and it points at
  // the offending field including the donor index — that is what lets a server
  // message land on the right input. Optional, so a response without it still parses.
  path: z.string().optional(),
});

export const apiMessagesSchema = z.object({
  messages: z.array(apiMessageSchema),
});

export type ApiMessage = z.infer<typeof apiMessageSchema>;

export class ApiError extends Error {
  readonly status: number;
  readonly messages: ApiMessage[];

  constructor(status: number, messages: ApiMessage[]) {
    super(`API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}
