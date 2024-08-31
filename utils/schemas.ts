import * as z from "zod";
import { ZodSchema } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters long",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters long",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters long",
  }),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  // Validate the formData object using profileSchema from zod
  const result = schema.safeParse(data);
  
  // If there are errors, throw an error message with the error message
  if (!result.success) {
    const error = result.error.errors.map((error) => error.message);
    throw new Error(error.join(","));
  }
  // If successful, return the data object
  return result.data;
}
