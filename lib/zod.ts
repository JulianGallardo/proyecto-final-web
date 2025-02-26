import { InstrumentoTypeDTO } from "@/types/instrumentoTypes";
import { EstadoEntrega, EstadoInstrumento, UrgenciaInstrumento } from "@prisma/client";
import {  object, string, z } from "zod"

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
  address: string({ required_error: "La dirección es requerida." }).min(1, "La dirección es requerida."),
  juzgado: string({ required_error: "El identificador de juzgado es requerido." }).min(1, "El identificador de juzgado es requerido."),
  instrumentType: string({ required_error: "El tipo de instrumento es requerido." }).min(1, "El tipo de instrumento es requerido."),
  urgencia: z.enum([UrgenciaInstrumento.NORMAL, UrgenciaInstrumento.URGENTE]),
  estado: z.enum([EstadoInstrumento.CORRECCIONES_SOLICITADAS, EstadoInstrumento.PENDIENTE_DE_NOTIFICAR, EstadoInstrumento.PENDIENTE_DE_PROCESAR_NOTIFICACION, EstadoInstrumento.NOTIFICADO_VERDE,EstadoInstrumento.NOTIFICADO_AMARILLO,EstadoInstrumento.NOTIFICADO_ROJO]),	
  observaciones: string()
})

export const juzgadoSchema = (Juzgados: JuzgadoDto[]) =>
  z.object({
    name: z
      .string({ required_error: "El nombre es requerido." })
      .min(1, "El nombre es requerido.")
      .refine(value => !Juzgados.some(juzgado => juzgado.name === value), {
        message: "El nombre ya existe.",
      }),

    identifier: z
      .string({ required_error: "El identificador es requerido." })
      .min(1, "El identificador es requerido.")
      .refine(value => !Juzgados.some(juzgado => juzgado.identifier === value), {
        message: "El identificador ya existe.",
      }),
  });

export const TypeSchema = (types: InstrumentoTypeDTO[]) =>
  z.object({
    name: z
      .string({ required_error: "El nombre es requerido." })
      .min(1, "El nombre es requerido.")
      .refine(value => !types.some(type => type.name === value), {
        message: "El nombre ya existe.",
      }),

    identifier: z
      .string({ required_error: "El identificador es requerido." })
      .min(1, "El identificador es requerido.")
      .refine(value => !types.some(type => type.identifier === value), {
        message: "El identificador ya existe.",
      }),
  });

export const addNewAgenteSchema = object({
  name: string({ required_error: "El nombre es requerido." })
    .min(1, "El nombre es requerido.")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  lastName: string({ required_error: "El apellido es requerido." })
    .min(1, "El apellido es requerido.")
    .max(32, "El apellido debe tener menos de 32 caracteres"),
  email: string({ required_error: "El correo electrónico es obligatorio" })
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico no válido"),
  password: string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  confirmPassword: string({ required_error: "La confirmación de la contraseña es obligatoria" })
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  telefono: z.coerce
    .number({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser un número",
    })
    .int()
    .positive()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const editAgenteSchema = object({
  name: string({ required_error: "El nombre es requerido." })
    .min(1, "El nombre es requerido.")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  lastName: string({ required_error: "El apellido es requerido." })
    .min(1, "El apellido es requerido.")
    .max(32, "El apellido debe tener menos de 32 caracteres"),
  email: string({ required_error: "El correo electrónico es obligatorio" })
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico no válido"),
  telefono: z.coerce
    .number({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser un número",
    })
    .int()
    .positive()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
});

export const loadNewEntregaInstrumentoSchema = object({
  observaciones: string().optional().or(z.null()).default(null),
  estado: z.enum([EstadoEntrega.NOTIFICADO, EstadoEntrega.NO_NOTIFICADO, EstadoEntrega.PENDIENTE_DE_PROCESAR]),
})
  

export const newPasswordSchema = z.object({
  password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "La contraseña debe incluir al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "La contraseña debe incluir al menos una letra minúscula" })
      .regex(/\d/, { message: "La contraseña debe incluir al menos un número" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z
.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una mayúscula")
    .regex(/\d/, "La nueva contraseña debe contener al menos un número"),
  confirmPassword: z.string().min(8, "La confirmación de contraseña debe tener al menos 8 caracteres"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["confirmPassword"],
});

export const addNewMesaEntradaSchema = object({
  name: string({ required_error: "El nombre es requerido." })
    .min(1, "El nombre es requerido.")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  lastName: string({ required_error: "El apellido es requerido." })
    .min(1, "El apellido es requerido.")
    .max(32, "El apellido debe tener menos de 32 caracteres"),
  email: string({ required_error: "El correo electrónico es obligatorio" })
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico no válido"),
  password: string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  confirmPassword: string({ required_error: "La confirmación de la contraseña es obligatoria" })
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  telefono: z.coerce
    .number({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser un número",
    })
    .int()
    .positive()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
});

export const updateMesaEntradaSchema = object({
  name: string({ required_error: "El nombre es requerido." })
    .min(1, "El nombre es requerido.")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  lastName: string({ required_error: "El apellido es requerido." })
    .min(1, "El apellido es requerido.")
    .max(32, "El apellido debe tener menos de 32 caracteres"),
  email: string({ required_error: "El correo electrónico es obligatorio" })
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico no válido"),
  telefono: z.coerce
    .number({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser un número",
    })
    .int()
    .positive()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
});