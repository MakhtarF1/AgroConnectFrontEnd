"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Package, Truck, Calendar, MapPin, Phone, ShoppingBag, Check } from "lucide-react"
import { getOrderById } from "../../services/acheteurService"
import AnimatedCard from "../../components/common/AnimatedCard"
import LoadingScreen from "../../components/common/LoadingScreen"

interface OrderItem {
  _id: string
  offre_id: {
    _id: string
    reference_id: {
      _id: string
      nom_produit?: string
      nom_materiel?: string
      photo?: string
    }
    prix_unitaire: number
    vendeur_id: {
      _id: string
      prenom: string
      nom: string
    }
  }
  quantite: number
  prix_unitaire: number
}

interface Order {
  _id: string
  acheteur_id: {
    _id: string
    prenom: string
    nom: string
  }
  date_commande: string
  statut: string
  montant_total: number
  adresse_livraison: string
  telephone_livraison: string
  instructions_livraison?: string
  methode_paiement: string
  items: OrderItem[]
  paiement?: {
    _id: string
    statut: string
    date_paiement: string
    methode: string
  }
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        if (id) {
          const data = await getOrderById(id)
          setOrder(data)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!order) {
    return (
      <div className="py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
        <p className="text-gray-600 mb-6">La commande que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link to="/orders" className="text-primary hover:text-primary-dark">
          Retour aux commandes
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmée":
        return "bg-blue-100 text-blue-800"
      case "en préparation":
        return "bg-purple-100 text-purple-800"
      case "en livraison":
        return "bg-indigo-100 text-indigo-800"
      case "livrée":
        return "bg-green-100 text-green-800"
      case "annulée":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "payé":
        return "bg-green-100 text-green-800"
      case "en attente":
        return "bg-yellow-100 text-yellow-800"
      case "échoué":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="py-6 fade-in">
      <div className="mb-6 slide-in">
        <Link to="/orders" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux commandes
        </Link>
      </div>

      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in"
        style={{ animationDelay: "100ms" }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commande #{order._id.substring(order._id.length - 8)}</h1>
          <p className="text-gray-600">Passée le {formatDate(order.date_commande)}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
              order.statut,
            )}`}
          >
            {order.statut}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6" delay={200}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Articles commandés</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={item._id} className="p-6 slide-in" style={{ animationDelay: `${300 + index * 100}ms` }}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 bg-gray-200 rounded-md overflow-hidden">
                      {item.offre_id.reference_id.photo ? (
                        <img
                          src={item.offre_id.reference_id.photo || "/placeholder.svg"}
                          alt={item.offre_id.reference_id.nom_produit || item.offre_id.reference_id.nom_materiel}
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
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.offre_id.reference_id.nom_produit || item.offre_id.reference_id.nom_materiel}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Vendeur: {item.offre_id.vendeur_id.prenom} {item.offre_id.vendeur_id.nom}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantité: {item.quantite} x {item.prix_unitaire.toLocaleString()} FCFA
                          </p>
                        </div>
                        <p className="text-primary font-medium">
                          {(item.prix_unitaire * item.quantite).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary">{order.montant_total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={400}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Informations de livraison</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Adresse de livraison</h3>
                    <p className="text-sm text-gray-600">{order.adresse_livraison}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Téléphone de contact</h3>
                    <p className="text-sm text-gray-600">{order.telephone_livraison}</p>
                  </div>
                </div>

                {order.instructions_livraison && (
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Instructions de livraison</h3>
                      <p className="text-sm text-gray-600">{order.instructions_livraison}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="lg:col-span-1">
          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6" delay={500}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Résumé de la commande</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande</span>
                  <span className="text-gray-900 font-medium">#{order._id.substring(order._id.length - 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900 font-medium">{formatDate(order.date_commande)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.statut)}`}
                  >
                    {order.statut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement</span>
                  <span className="text-gray-900 font-medium">
                    {order.methode_paiement === "orange_money" ? "Orange Money" : "Wave"}
                  </span>
                </div>
                {order.paiement && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut du paiement</span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paiement.statut)}`}
                      >
                        {order.paiement.statut}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date du paiement</span>
                      <span className="text-gray-900 font-medium">{formatDate(order.paiement.date_paiement)}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary">{order.montant_total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={600}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Suivi de commande</h2>
            </div>
            <div className="p-6">
              <div className="space-y-8">
                <div className="relative">
                  <div
                    className={`absolute top-0 left-4 -ml-px h-full w-0.5 ${order.statut !== "annulée" ? "bg-primary" : "bg-red-500"}`}
                  ></div>
                  <div className="relative flex items-start">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Commande passée</h3>
                      <p className="text-xs text-gray-500">{formatDate(order.date_commande)}</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={`absolute top-0 left-4 -ml-px h-full w-0.5 ${
                      ["confirmée", "en préparation", "en livraison", "livrée"].includes(order.statut)
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="relative flex items-start">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        ["confirmée", "en préparation", "en livraison", "livrée"].includes(order.statut)
                          ? "bg-primary"
                          : "bg-gray-200"
                      }`}
                    >
                      <Package
                        className={`h-4 w-4 ${
                          ["confirmée", "en préparation", "en livraison", "livrée"].includes(order.statut)
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Commande confirmée</h3>
                      <p className="text-xs text-gray-500">
                        {["confirmée", "en préparation", "en livraison", "livrée"].includes(order.statut)
                          ? "Le vendeur a confirmé votre commande"
                          : "En attente de confirmation"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={`absolute top-0 left-4 -ml-px h-full w-0.5 ${
                      ["en préparation", "en livraison", "livrée"].includes(order.statut) ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="relative flex items-start">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        ["en préparation", "en livraison", "livrée"].includes(order.statut)
                          ? "bg-primary"
                          : "bg-gray-200"
                      }`}
                    >
                      <Package
                        className={`h-4 w-4 ${
                          ["en préparation", "en livraison", "livrée"].includes(order.statut)
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">En préparation</h3>
                      <p className="text-xs text-gray-500">
                        {["en préparation", "en livraison", "livrée"].includes(order.statut)
                          ? "Votre commande est en cours de préparation"
                          : "Pas encore en préparation"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={`absolute top-0 left-4 -ml-px h-full w-0.5 ${
                      ["en livraison", "livrée"].includes(order.statut) ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="relative flex items-start">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        ["en livraison", "livrée"].includes(order.statut) ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <Truck
                        className={`h-4 w-4 ${
                          ["en livraison", "livrée"].includes(order.statut) ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">En livraison</h3>
                      <p className="text-xs text-gray-500">
                        {["en livraison", "livrée"].includes(order.statut)
                          ? "Votre commande est en cours de livraison"
                          : "Pas encore en livraison"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative flex items-start">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        order.statut === "livrée" ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <Check className={`h-4 w-4 ${order.statut === "livrée" ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Livrée</h3>
                      <p className="text-xs text-gray-500">
                        {order.statut === "livrée" ? "Votre commande a été livrée" : "Pas encore livrée"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

