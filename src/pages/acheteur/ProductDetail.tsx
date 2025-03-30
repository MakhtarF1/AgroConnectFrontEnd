"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ShoppingBag, ShoppingCart, ArrowLeft, Check, Truck, Calendar } from "lucide-react"
import { getProductById } from "../../services/acheteurService"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/common/Button"
import LoadingScreen from "../../components/common/LoadingScreen"
import AnimatedCard from "../../components/common/AnimatedCard"
import toast from "react-hot-toast"

interface Product {
  _id: string
  nom_produit: string
  description: string
  prix_unitaire: number
  quantite_disponible: number
  unite_mesure: string
  categorie: string
  photo?: string
  vendeur_id: {
    _id: string
    prenom: string
    nom: string
  }
  date_recolte?: string
  date_expiration?: string
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        if (id) {
          const data = await getProductById(id)
          setProduct(data)
          setQuantity(1)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Erreur lors du chargement du produit")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour ajouter des produits au panier")
      return
    }

    if (!product) return

    addItem({
      offre_id: product._id,
      nom_produit: product.nom_produit,
      prix_unitaire: product.prix_unitaire,
      quantite: quantity,
      vendeur_nom: `${product.vendeur_id.prenom} ${product.vendeur_id.nom}`,
      image: product.photo,
      stock_disponible: product.quantite_disponible,
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!product) {
    return (
      <div className="py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/products" className="text-primary hover:text-primary-dark">
          Retour aux produits
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6 fade-in">
      <div className="mb-6 slide-in">
        <Link to="/products" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={100}>
          <div className="h-80 bg-gray-200 relative">
            {product.photo ? (
              <img
                src={product.photo || "/placeholder.svg"}
                alt={product.nom_produit}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <ShoppingBag className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
        </AnimatedCard>

        <div className="slide-in" style={{ animationDelay: "200ms" }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nom_produit}</h1>
          <p className="text-xl font-bold text-primary mb-4">{product.prix_unitaire.toLocaleString()} FCFA</p>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-sm text-gray-600">
              Vendu par: {product.vendeur_id.prenom} {product.vendeur_id.nom}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Date de récolte: {formatDate(product.date_recolte)}</span>
            </div>
            {product.date_expiration && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">Date d'expiration: {formatDate(product.date_expiration)}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Truck className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Livraison disponible</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">
                {product.quantite_disponible > 0
                  ? `${product.quantite_disponible} ${product.unite_mesure} disponibles`
                  : "Rupture de stock"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                disabled={quantity <= 1}
                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.quantite_disponible}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(Math.max(Number.parseInt(e.target.value) || 1, 1), product.quantite_disponible))
                }
                className="w-16 text-center border-y border-gray-300 py-1"
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.quantite_disponible))}
                disabled={quantity >= product.quantite_disponible}
                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={product.quantite_disponible <= 0}
            className="w-full md:w-auto"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

