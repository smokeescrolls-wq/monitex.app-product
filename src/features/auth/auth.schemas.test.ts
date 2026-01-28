import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth.schemas";

describe("auth.schemas", () => {
  it("loginSchema valida email e senha", () => {
    expect(loginSchema.safeParse({ email: "a@a.com", password: "123456" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "x", password: "123" }).success).toBe(false);
  });

  it("registerSchema exige e-mails iguais", () => {
    const ok = registerSchema.safeParse({
      fullName: "Leonardo Albano",
      email: "a@a.com",
      confirmEmail: "a@a.com",
      password: "123456",
    });
    expect(ok.success).toBe(true);

    const bad = registerSchema.safeParse({
      fullName: "Leonardo Albano",
      email: "a@a.com",
      confirmEmail: "b@b.com",
      password: "123456",
    });
    expect(bad.success).toBe(false);
  });
});
