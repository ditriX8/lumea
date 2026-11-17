import { createContext, useContext } from 'react'

export type CartItem = { id: string; qty: number }

export type CartApi = {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const CartContext = createContext<CartApi | null>(null)

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
