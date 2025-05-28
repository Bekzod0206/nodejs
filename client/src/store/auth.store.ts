import type { IUser } from "@/interfaces"
import {create} from "zustand"

type AuthStoreType = {
  isLoading: boolean
  isAuth: boolean
  user: IUser
  setUser: (user: IUser) => void
  setLoading: (status: boolean) => void
  setIsAuth: (status: boolean) => void
}

export const authStore = create<AuthStoreType>(set => ({
  isLoading: false,
  isAuth: false,
  user: {} as IUser,
  setUser: (user: IUser) => set({user}),
  setLoading: (status: boolean) => set({isLoading: status}),
  setIsAuth: (status: boolean) => set({isAuth: status})
})) 