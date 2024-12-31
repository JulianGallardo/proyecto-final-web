import { object, string, z } from "zod"
 
export const logInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const addNewZoneSchema = object({
  zoneName: string({ required_error: "El nombre de la zona es obligatorio." })
    .min(1, "El nombre de la zona es obligatorio.")
    .max(32, "El nombre de la zona debe tener menos de 32 caracteres"),
  zoneColor: string({ required_error: "La seleccion de un color es obligatoria." }),
  colorOption: z.enum(["chosen", "random"]),

})