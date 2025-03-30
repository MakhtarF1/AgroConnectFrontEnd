"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = (offreId: string, quantity: number) => {
    setIsUpdating(true)
    updateQuantity(offreId, quantity)
    setTimeout(() => setIsUpdating(false), 300)
  }

  return (
    <div className="py-6 fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 slide-in">Mon Panier</h1>

      {items.length === 0 ? (
        <AnimatedCard className="bg-white rounded-lg shadow-sm border p-8 text-center" delay={100}>
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Votre panier est vide</h3>
          <p className="mt-1 text-gray-500">Commencez vos achats pour ajouter des produits à votre panier.</p>
          <Button to="/products" variant="primary" className="mt-4">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Parcourir les produits
          </Button>
        </AnimatedCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={100}>
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Articles ({items.length})</h2>
              </div>

              <ul className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <li key={item.offre_id} className="p-6 slide-in" style={{ animationDelay: `${200 + index * 100}ms` }}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 bg-gray-200 rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.nom_produit}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 sm:ml-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.nom_produit}</h3>
                            <p className="mt-1 text-sm text-gray-500">Vendeur: {item.vendeur_nom}</p>
                            <p className="mt-1 text-primary font-medium">{item.prix_unitaire.toLocaleString()} FCFA</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.offre_id)}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center">
                          <label htmlFor={`quantity-${item.offre_id}`} className="text-sm text-gray-700 mr-2">
                            Quantité:
                          </label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.offre_id, Math.max(item.quantite - 1, 1))}
                              disabled={item.quantite <= 1 || isUpdating}
                              className="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              id={`quantity-${item.offre_id}`}
                              min="1"
                              max={item.stock_disponible}
                              value={item.quantite}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.offre_id,
                                  Math.min(Math.max(Number.parseInt(e.target.value) || 1, 1), item.stock_disponible),
                                )
                              }
                              className="w-12 text-center border-y border-gray-300 py-1"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(item.offre_id, Math.min(item.quantite + 1, item.stock_disponible))
                              }
                              disabled={item.quantite >= item.stock_disponible || isUpdating}
                              className="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                          <span className="ml-4 text-sm text-gray-500">{item.stock_disponible} disponibles</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          </div>

          <div className="lg:col-span-1">
            <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-20" delay={300}>
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Résumé de la commande</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="text-gray-900 font-medium">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="text-gray-900 font-medium">À calculer</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-bold text-primary">{totalPrice.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button to="/checkout" variant="primary" fullWidth>
                    Passer à la caisse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link to="/products" className="block text-center mt-4 text-sm text-primary hover:text-primary-dark">
                    Continuer vos achats
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

