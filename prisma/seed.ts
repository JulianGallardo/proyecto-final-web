import InstrumentosRepository from "@/repositories/InstrumentosRepository";
import InstrumentTypeRepository from "@/repositories/InstrumentTypeRepository";
import JuzgadoRepository from "@/repositories/JuzgadoRepository";
import OrdenRepository from "@/repositories/OrdenRepository";
import UserRepository from "@/repositories/UserRepository";
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
    { name: "CEDULA", identifier: "C" },
    { name: "LEY Nº 22.172", identifier: "L" },
    { name: "INTIMACION", identifier: "I" },
    { name: "CONSTATACION", identifier: "CO" },
    { name: "MANDAMIENTO", identifier: "M" }
];

const Juzgados: Prisma.JuzgadoCreateInput[] = [
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 1 - BAHIA BLANCA", identifier: "JCC1" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 2 - BAHIA BLANCA", identifier: "JCC2" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 3 - BAHIA BLANCA", identifier: "JCC3" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 4 - BAHIA BLANCA", identifier: "JCC4" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 5 - BAHIA BLANCA", identifier: "JCC5" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 6 - BAHIA BLANCA", identifier: "JCC6" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 7 - BAHIA BLANCA", identifier: "JCC7" },
    { name: "JUZGADO EN LO CIVIL Y COMERCIAL Nº 8 - BAHIA BLANCA", identifier: "JCC8" },
    { name: "TRIBUNAL DEL TRABAJO Nº 1 - BAHIA BLANCA", identifier: "TT1" },
    { name: "TRIBUNAL DEL TRABAJO Nº 2 - BAHIA BLANCA", identifier: "TT2" },
    { name: "TRIBUNAL DEL TRABAJO Nº 3 - BAHIA BLANCA", identifier: "TT3" },
    { name: "JUZGADO DE FAMILIA N° 1 - BAHIA BLANCA", identifier: "JF1" },
    { name: "JUZGADO DE FAMILIA N° 2 - BAHIA BLANCA", identifier: "JF2" },
    { name: "JUZGADO DE FAMILIA N° 3 - BAHIA BLANCA", identifier: "JF3" },
    { name: "CEDULAS DE MEDIACION", identifier: "MED" },
    { name: "CEDULAS DEL COLEGIO DE ABOGADOS DE BAHIA BLANCA", identifier: "CABB" },
    { name: "TRIBUNAL EN LO CRIMINAL Nº 1 JUICIO POR JURADO - BAHIA BLANCA", identifier: "Tcri N1 JXJ" },
    { name: "TRIBUNAL EN LO CRIMINAL Nº 2 JUICIO POR JURADO - BAHIA BLANCA", identifier: "Tcri N2 JXJ" },
    { name: "TRIBUNAL EN LO CRIMINAL Nº 3 JUICIO POR JURADO - BAHIA BLANCA", identifier: "Tcri N3 JXJ" },
    { name: "TRIBUNAL EN LO CRIMINAL Nº 1 - TRES ARROYOS", identifier: "Tcri N1 TA" },
    { name: "JUZGADO CORRECCIONAL Nº 1 - BAHIA BLANCA", identifier: "JCorr1" },
    { name: "JUZGADO CORRECCIONAL Nº 2 - BAHIA BLANCA", identifier: "JCorr2" },
    { name: "JUZGADO CORRECCIONAL Nº 3 - BAHIA BLANCA", identifier: "JCorr3" },
    { name: "JUZGADO CORRECCIONAL Nº 4 - BAHIA BLANCA", identifier: "JCorr4" },
    { name: "JUZGADO DE GARANTIAS Nº 1 - BAHIA BLANCA", identifier: "JGtia 1" },
    { name: "JUZGADO DE GARANTIAS Nº 2 - BAHIA BLANCA", identifier: "JGtia 2" },
    { name: "JUZGADO DE GARANTIAS Nº 3 - BAHIA BLANCA", identifier: "JGtia 3" },
    { name: "JUZGADO DE GARANTIAS Nº 4 - BAHIA BLANCA", identifier: "JGtia 4" },
    { name: "JUZGADO DE EJECUCION PENAL Nº 1 - BAHIA BLANCA", identifier: "Ejec1" },
    { name: "JUZGADO DE EJECUCION PENAL Nº 2 - BAHIA BLANCA", identifier: "Ejec2" },
    { name: "JUZGADO DE RESPONSABILIDAD PENAL JUVENIL Nº 1 - BAHIA BLANCA", identifier: "Resp1" },
    { name: "JUZGADO DE RESPONSABILIDAD PENAL JUVENIL Nº 2 - BAHIA BLANCA", identifier: "Resp2" },
    { name: "UNIDAD FUNCIONAL DE INVESTIGACION Y JUICIO - BAHIA BLANCA", identifier: "UFIJ" },
    { name: "PROVINCIA (TODAS LAS CEDULAS DE PROVINCIA) - BAHIA BLANCA", identifier: "Prov" },
    { name: "LEY Nº 22.172 - BAHIA BLANCA", identifier: "Ley" },
    { name: "CAMARA PENAL SALA 1 - BAHIA BLANCA", identifier: "CP SALAI" },
    { name: "CAMARA PENAL SALA 2 - BAHIA BLANCA", identifier: "CP SALAII" },
    { name: "CAMARA CIVIL SALA 1 - BAHIA BLANCA", identifier: "CC SALAI" },
    { name: "CAMARA CIVIL SALA 2 - BAHIA BLANCA", identifier: "CC SALAII" },
    { name: "JUZGADO CRIMINAL Nº 1 - BAHIA BLANCA", identifier: "CRIM 1" },
    { name: "JUZGADO CRIMINAL Nº 2 - BAHIA BLANCA", identifier: "CRIM 2" },
    { name: "JUZGADO CRIMINAL Nº 3 - BAHIA BLANCA", identifier: "CRIM 3" },
    { name: "BUS FEDERAL", identifier: "BUS" },
    { name: "SECRETARIA DE SERVICIOS JURISDICCIONALES", identifier: "Sec de SS" },
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

    console.log("Seed completed");
}

main()

