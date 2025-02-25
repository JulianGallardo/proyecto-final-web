"use client";

import { Prisma, User } from "@prisma/client";
import SearchInput from "../shared/search";
import { Button } from "../ui/button";
import { Plus, SadCircle } from "@mynaui/icons-react";
import { useCustomDialog } from "@/hooks/useCustomDialog";
import CustomDialog from "../instrumentos/Dialogs/dialog";
import { toast } from "@/hooks/use-toast";
import PaginationInstruments from "../instrumentos/Tabla/Pagination";
import CustomAlert from "../instrumentos/Dialogs/alert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useState } from "react";
import { FormularioNuevaMesaEntrada } from "./Forms/addNewMesaEntradaForm";
import { MesaEntradaCard } from "./mesaEntradaCard";
import { createUser, deleteUser, updateUser } from "@/actions/user-actions";
import { FormularioActualizarMesaEntrada } from "./Forms/updateMesaEntradaForm";

interface PersonalDeMesaDeEntradaListProps {
  personal: User[]; // Updated interface name
  totalPages: number;
}

export default function ListaMesaDeEntrada({ personal, totalPages }: Readonly<PersonalDeMesaDeEntradaListProps>) {
  const { setIsOpen } = useCustomDialog();
  const { setIsOpenAlert } = useCustomAlert();

  const [personalSelected, setPersonalSelected] = useState<User | null>(null);

  const handleNewPersonalDeMesaDeEntrada = () => {
    setIsOpen(true);
  };

  const handleCreateNewPersonalDeMesaDeEntrada = async (data: Prisma.UserCreateInput) => {
    try {
      const personal = await createUser(data);
      if (personal) {
        toast({
          title: "Personal de Mesa de Entrada registrado",
          description: "El personal de mesa de entrada ha sido registrado con éxito.",
          className: "bg-green-500 text-white",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al registrar el nuevo personal de mesa de entrada.",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
    setIsOpen(false);
  };

  const handleOpenDeleteAlert = (personal: User) => {
    setPersonalSelected(personal);
    setIsOpenAlert(true);
  };


  const handleOpenUpdateDialog = (personal: User) => {
    setPersonalSelected(personal);
    setIsOpen(true);
  }


  const handleUpdatePersonalDeMesaDeEntrada = async (data: Prisma.UserUpdateInput) => {

    if (!personalSelected?.id) return;

    try {
      const personal = await updateUser(personalSelected.id, data);
      if (personal) {
        toast({
          title: "Personal de Mesa de Entrada actualizado",
          description: "El personal de mesa de entrada ha sido actualizado con éxito.",
          className: "bg-green-500 text-white",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al actualizar el personal de mesa de entrada.",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
    setPersonalSelected(null);
    setIsOpen(false);
  }

  const handleDeletePersonalDeMesaDeEntrada = async () => {
    if (!personalSelected) return;
    try {
      const personal = await deleteUser(personalSelected.id);
      if (personal) {
        toast({
          title: "Personal de Mesa de Entrada eliminado",
          description: "El personal de mesa de entrada se ha eliminado con éxito.",
          className: "bg-green-500 text-white",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al eliminar el personal de mesa de entrada.",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
    setPersonalSelected(null);
    setIsOpenAlert(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
      <CustomDialog
        dialogTitle="Crear personal de mesa de entrada"
        dialogDescription="Registrar un nuevo personal de mesa de entrada al equipo."
        propDialogContent={
          personalSelected ? (
            <FormularioActualizarMesaEntrada
              personal={personalSelected}
              onSubmit={handleUpdatePersonalDeMesaDeEntrada}
            />
          ) : (
            <FormularioNuevaMesaEntrada onSubmit={handleCreateNewPersonalDeMesaDeEntrada} />
          )
        }
      />
      <CustomAlert
        AlertTitle="Eliminar personal de mesa de entrada"
        AlertDescription="¿Está seguro que desea eliminar este personal de mesa de entrada?"
        propAlertDialogContent={
          <div className="flex justify-end gap-4">
            <Button className="bg-red-500 text-white" onClick={handleDeletePersonalDeMesaDeEntrada}>
              Eliminar
            </Button>
            <Button className="bg-gray-500 text-white" onClick={() => setIsOpenAlert(false)}>
              Cancelar
            </Button>
          </div>
        }
      />
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <SearchInput placeholder="Buscar por nombre..." />
        <Button
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          onClick={handleNewPersonalDeMesaDeEntrada}
        >
          <span>Crear Personal de Mesa de Entrada</span>
          <Plus />
        </Button>
      </div>
      {personal.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg">
          <SadCircle className="w-12 h-12 text-gray-500" />
          <span className="text-gray-500">No se han encontrado personal de mesa de entrada registrados.</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personal.map((user) => (
          <MesaEntradaCard key={user.id} personal={user} onDelete={() => handleOpenDeleteAlert(user)} onEdit={()=>handleOpenUpdateDialog(user)}/>
        ))}
      </div>
      {personal.length !== 0 && <PaginationInstruments totalPages={totalPages} />}
    </div>
  );
}