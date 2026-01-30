import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Enter your email address.")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(6, "The password must be at least 6 characters long.")
  .max(72, "Password too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Enter your full name").max(120),
    email: emailSchema,
    confirmEmail: emailSchema,
    password: passwordSchema,
  })
  .refine((v) => v.email.toLowerCase() === v.confirmEmail.toLowerCase(), {
    message: "The emails don't match.",
    path: ["confirmEmail"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
