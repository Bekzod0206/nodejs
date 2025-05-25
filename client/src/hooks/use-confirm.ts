import type { IPost } from "@/interfaces"
import { create } from "zustand"

type ConfirmStore = {
  isOpen: boolean
  post: IPost
  setPost: (post: IPost) => void  
  onOpen: () => void
  onClose: () => void
}

export const useConfirm = create<ConfirmStore>((set) => ({
  isOpen: false,
  post: {} as IPost,
  setPost: post => set({post}),
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))