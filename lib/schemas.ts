import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  cedula: z
    .string()
    .min(1, "La cédula es obligatoria")
    .regex(/^[VEJPvejp]-?\d{5,9}$/, "Formato inválido (ej: V-12345678)"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Ingrese un email válido"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Ingrese un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Ingrese un email válido"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme su contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
