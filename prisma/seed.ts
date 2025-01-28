import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import OrdenRepository from "@/repositories/OrdenRepository";
import UserRepository from "@/repositories/UserRepository";
import { InstrumentoDTO } from "@/types/instrumentoTypes";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";


const userRepository = new UserRepository();
const instrumentTypeRepository = new InstrumentTypeRepository();
const juzgadoRepository = new JuzgadoRepository();
const ordenRepository = new OrdenRepository();
const instrumentosRepository = new InstrumentosRepository(ordenRepository);
const saltNumber = 10;


const users = [
    {
        name: "Jefatura",
        email: "admin@admin.com",
        password: "admin12345",
        role: Role.jefatura,
    },
    {
        name: "Mesa de entrada",
        email: "mesaEntrada@mesaEntrada.com",
        password: "mesaEntrada12345",
        role: Role.mesa_de_entrada,
    },
    {
        name: "Agente",
        email: "agente@agente.com",
        password: "agente12345",
        role: Role.agente,
    },
];


const instrumentTypes: Prisma.InstrumentoTypeCreateInput[] = [
    {
        name: "Cedula",
        identifier: "C",

    },
    {
        name:"Mandamiento",
        identifier:"M"
    }
]

const Juzgados: Prisma.JuzgadoCreateInput[] = [
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 1 - BAHIA BLANCA", identifier: "JCC1" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 2 - BAHIA BLANCA", identifier: "JCC2" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 3 - BAHIA BLANCA", identifier: "JCC3" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 4 - BAHIA BLANCA", identifier: "JCC4" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 5 - BAHIA BLANCA", identifier: "JCC5" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 6 - BAHIA BLANCA", identifier: "JCC6" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 7 - BAHIA BLANCA", identifier: "JCC7" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 8 - BAHIA BLANCA", identifier: "JCC8" },
    { name: "TRIBUNAL  DEL  TRABAJO Nº 1 - BAHIA  BLANCA", identifier: "TT1" },
    { name: "TRIBUNAL  DEL  TRABAJO Nº 2 - BAHIA  BLANCA", identifier: "TT2" },
    { name: "JUZGADO DE FAMILIA N° 1 - BAHIA BLANCA", identifier: "JF1" },
    { name: "JUZGADO DE FAMILIA N° 2 - BAHIA BLANCA", identifier: "JF2" },
    { name: "JUZGADO DE FAMILIA N° 3 - BAHIA BLANCA", identifier: "JF3" },
    { name: "JUZGADO DE FAMILIA N° 4 - BAHIA BLANCA", identifier: "JF4" },
    { name: "PROVINCIAL", identifier: "Prov" },
];




async function createUsers() {
    for (const user of users) {
        const hash = await bcrypt.hash(user.password, saltNumber);
        user.password = hash;
        await userRepository.create(user);
    }
}

async function createInstrumentTypes() {
    for (const instrumentType of instrumentTypes) {
        await instrumentTypeRepository.create(instrumentType);
    }
}

async function createJuzgados() {
    for (const juzgado of Juzgados) {
        await juzgadoRepository.create(juzgado);
    }
}

const InstrumentosDePrueba: InstrumentoDTO[] = [
    {
        fecha_de_ingreso: new Date(),
        fecha_de_salida: new Date(),
        caratula: "Caratula 1",
        destinatario: "Destinatario 1",
        domicilio_denunciado: "Direccion 1",
        juzgadoIdentifier: "JCC1",
        instrumentoTypeIdentifier: "C",
    },
    {
        fecha_de_ingreso: new Date(),
        fecha_de_salida: new Date(),
        caratula: "Caratula 2",
        destinatario: "Destinatario 2",
        domicilio_denunciado: "Direccion 2",
        juzgadoIdentifier: "JCC2",
        instrumentoTypeIdentifier: "C",
    },
    {
        fecha_de_ingreso: new Date(),
        fecha_de_salida: null,
        caratula: "Caratula 3",
        destinatario: "Destinatario 3",
        domicilio_denunciado: "Direccion 3",
        juzgadoIdentifier: "JCC3",
        instrumentoTypeIdentifier: "C",
    },
];


async function createInstrumentos() {
    for (const instrumento of InstrumentosDePrueba) {
        await instrumentosRepository.createInstrumento(instrumento);
    }
}

async function main() {
    await userRepository.deleteAll();
    await createUsers();
    console.log("Users created");
    await instrumentTypeRepository.deleteAll();
    await createInstrumentTypes();
    console.log("Instrument Types created");
    await juzgadoRepository.deleteAll();
    await createJuzgados();
    console.log("Juzgados created");
    await instrumentosRepository.deleteAll();
    await createInstrumentos();
    console.log("Instrumentos created");

    console.log("Seed completed");
}

main()

