import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, { message: "Username must be atleast 5 characters" })
  .max(255)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscores",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" })
    .max(255),
});
