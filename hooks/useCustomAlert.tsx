import {create} from 'zustand';

interface CustomAlertProps{
    isOpenAlert:boolean
    setIsOpenAlert:(open:boolean) => void
}

export const useCustomAlert = create<CustomAlertProps>((set) => ({
    isOpenAlert:false,
    setIsOpenAlert: (open:boolean) => set({isOpenAlert:open})
}))