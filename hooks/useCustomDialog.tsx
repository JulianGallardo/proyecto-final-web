import {create} from 'zustand';

interface CustomDialogProps{
    isOpen:boolean
    setIsOpen:(open:boolean) => void
}

export const useCustomDialog = create<CustomDialogProps>((set) => ({
    isOpen:false,
    setIsOpen: (open:boolean) => set({isOpen:open})
}))