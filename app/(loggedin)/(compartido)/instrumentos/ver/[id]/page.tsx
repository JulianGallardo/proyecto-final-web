import { getAll } from "@/actions/zone-actions";
import InfoInstrumento from "@/components/instrumentos/ver/InfoInstrumento";




export default async function Page(){
    const zonas = await getAll();
    return (
        <div className="w-full h-full p-4">
            <InfoInstrumento zonas={zonas}/>
        </div>
    );
}