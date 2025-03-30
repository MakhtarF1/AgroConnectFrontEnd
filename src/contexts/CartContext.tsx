"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import toast from "react-hot-toast"

interface CartItem {
  offre_id: string
  nom_produit: string
  prix_unitaire: number
  quantite: number
  vendeur_nom: string
  image?: string
  stock_disponible: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (offreId: string) => void
  updateQuantity: (offreId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.offre_id === item.offre_id)

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantite + item.quantite

        // Check if new quantity exceeds available stock
        if (newQuantity > item.stock_disponible) {
          toast.error("Quantité maximale disponible atteinte")
          return prevItems
        }

        updatedItems[existingItemIndex].quantite = newQuantity
        toast.success("Quantité mise à jour dans le panier")
        return updatedItems
      } else {
        // Add new item
        toast.success("Produit ajouté au panier")
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (offreId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.offre_id !== offreId))
    toast.success("Produit retiré du panier")
  }

  const updateQuantity = (offreId: string, quantity: number) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.offre_id === offreId) {
          // Check if new quantity exceeds available stock
          if (quantity > item.stock_disponible) {
            toast.error("Quantité maximale disponible atteinte")
            return item
          }
          return { ...item, quantite: quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((total, item) => total + item.quantite, 0)

  const totalPrice = items.reduce((total, item) => total + item.prix_unitaire * item.quantite, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

