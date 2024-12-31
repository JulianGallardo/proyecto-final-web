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
  zoneName: string({ required_error: "Zone Name is required" })
    .min(1, "Zone Name is required")
    .max(32, "Zone Name must be less than 32 characters"),
  zoneColor: string({ required_error: "Zone Color is required" }),
  colorOption: z.enum(["random", "chosen"]),

})