import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Informe seu e-mail")
  .email("E-mail inválido");

export const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .max(72, "Senha muito longa");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Informe seu nome completo").max(120),
    email: emailSchema,
    confirmEmail: emailSchema,
    password: passwordSchema,
  })
  .refine((v) => v.email.toLowerCase() === v.confirmEmail.toLowerCase(), {
    message: "Os e-mails não coincidem",
    path: ["confirmEmail"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
