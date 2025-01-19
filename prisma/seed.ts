import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import UserRepository from "@/repositories/UserRepository";
import { InstrumentoDTO } from "@/types/instrumento";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";


const userRepository = new UserRepository();
const instrumentTypeRepository = new InstrumentTypeRepository();
const juzgadoRepository = new JuzgadoRepository();
const instrumentosRepository = new InstrumentosRepository();
const saltNumber = 10;


const users = [
    {
        name: "Admin User",
        email: "admin@admin.com",
        password: "admin12345",
        role: Role.admin,
    },
    {
        name: "Test User",
        email: "test@test.com",
        password: "test12345",
        role: Role.user,
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
    { name: "Juzgado en lo Civil y Comercial N° 1", identifier: "JCC1" },
    { name: "Juzgado en lo Civil y Comercial N° 2", identifier: "JCC2" },
    { name: "Juzgado en lo Civil y Comercial N° 3", identifier: "JCC3" },
    { name: "Juzgado en lo Civil y Comercial N° 4", identifier: "JCC4" },
    { name: "Juzgado en lo Civil y Comercial N° 5", identifier: "JCC5" },
    { name: "Juzgado en lo Civil y Comercial N° 6", identifier: "JCC6" },
    { name: "Juzgado en lo Civil y Comercial N° 7", identifier: "JCC7" },
    { name: "Juzgado en lo Civil y Comercial N° 8", identifier: "JCC8" },
    { name: "Tribunal de Trabajo N° 1", identifier: "TT1" },
    { name: "Tribunal de Trabajo N° 2", identifier: "TT2" },
    { name: "Juzgado de Familia N° 1", identifier: "JF1" },
    { name: "Juzgado de Familia N° 2", identifier: "JF2" },
    { name: "Juzgado de Familia N° 3", identifier: "JF3" },
    { name: "Juzgado de Familia N° 4", identifier: "JF4" },
    { name: "Centro de Mediación", identifier: "MED" },
    { name: "Cámara de Apelaciones en lo Civil y Comercial", identifier: "CAAB" },
    { name: "Tribunal en lo Criminal N° 1", identifier: "Tcri N1 JXJ" },
    { name: "Tribunal en lo Criminal N° 2", identifier: "Tcri N2 JXJ" },
    { name: "Tribunal en lo Criminal N° 3", identifier: "Tcri N3 JXJ" },
    { name: "Juzgado Correccional N° 1", identifier: "JCorr1" },
    { name: "Juzgado Correccional N° 2", identifier: "JCorr2" },
    { name: "Juzgado Correccional N° 3", identifier: "JCorr3" },
    { name: "Juzgado Correccional N° 4", identifier: "JCorr4" },
    { name: "Juzgado de Garantías N° 1", identifier: "JGtia 1" },
    { name: "Juzgado de Garantías N° 2", identifier: "JGtia 2" },
    { name: "Juzgado de Garantías N° 3", identifier: "JGtia 3" },
    { name: "Juzgado de Garantías N° 4", identifier: "JGtia 4" },
    { name: "Juzgado de Ejecución N° 1", identifier: "Ejec1" },
    { name: "Juzgado de Ejecución N° 2", identifier: "Ejec2" },
    { name: "Juzgado de Responsabilidad Penal Juvenil N° 1", identifier: "Resp1" },
    { name: "Juzgado de Responsabilidad Penal Juvenil N° 2", identifier: "Resp2" },
    { name: "Unidad Funcional de Instrucción y Juicio", identifier: "UFIJ" },
    { name: "Juzgado de Familia N° 1", identifier: "Fam1" },
    { name: "Juzgado de Familia N° 2", identifier: "Fam2" },
    { name: "Juzgado de Familia N° 3", identifier: "Fam3" },
    { name: "Cámara Penal Sala I", identifier: "CP SALAI" },
    { name: "Cámara Penal Sala II", identifier: "CP SALAII" },
    { name: "Cámara Civil Sala I", identifier: "CC SALAI" },
    { name: "Cámara Civil Sala II", identifier: "CC SALAII" },
    { name: "Tribunal Criminal N° 1", identifier: "CRIM 1" },
    { name: "Tribunal Criminal N° 2", identifier: "CRIM 2" },
    { name: "Tribunal Criminal N° 3", identifier: "CRIM 3" },
    { name: "Oficina de Búsquedas", identifier: "BUS" },
    { name: "Secretaría de Seguridad Social", identifier: "Sec de SS" },
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
        entryDate: new Date(),
        exitDate: new Date(),
        caratula: "Caratula 1",
        destinatario: "Destinatario 1",
        address: "Direccion 1",
        ordenNumber: "1",
        juzgadoId: "JCC1",
        instrumentoTypeId: "C",
    },
    {
        entryDate: new Date(),
        exitDate: new Date(),
        caratula: "Caratula 2",
        destinatario: "Destinatario 2",
        address: "Direccion 2",
        ordenNumber: "2",
        juzgadoId: "JCC2",
        instrumentoTypeId: "C",
    },
    {
        entryDate: new Date(),
        exitDate: new Date(),
        caratula: "Caratula 3",
        destinatario: "Destinatario 3",
        address: "Direccion 3",
        ordenNumber: "3",
        juzgadoId: "JCC3",
        instrumentoTypeId: "C",
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

