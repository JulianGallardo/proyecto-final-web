import { object, string, z } from "zod"
 
export const logInSchema = object({
  email: string({ required_error: "El correo electrónico es obligatorio" })
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico no válido"),
  password: string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});


export const addNewZoneSchema = object({
  zoneName: string({ required_error: "El nombre de la zona es obligatorio." })
    .min(1, "El nombre de la zona es obligatorio.")
    .max(32, "El nombre de la zona debe tener menos de 32 caracteres"),
  zoneColor: string({ required_error: "La seleccion de un color es obligatoria." }),
  colorOption: z.enum(["chosen", "random"]),

})

export const instrumentSchema = object({
  entryDate: string({ required_error: "La fecha de entrada es requerida." }).min(1, "La fecha de entrada es requerida."),
  exitDate: string({}).optional().or(z.literal("")).default(""),
  caratula: string({ required_error: "La carátula es requerida." }).min(1, "La carátula es requerida."),
  destinatario: string({ required_error: "El destinatario es requerido." }).min(1, "El destinatario es requerido."),
  address: string({ required_error: "La dirección es requerida." }).min(1, "La dirección es requerida."),
  juzgado: string({ required_error: "El identificador de juzgado es requerido." }).min(1, "El identificador de juzgado es requerido."),
  instrumentType: string({ required_error: "El tipo de instrumento es requerido." }).min(1, "El tipo de instrumento es requerido."),
})