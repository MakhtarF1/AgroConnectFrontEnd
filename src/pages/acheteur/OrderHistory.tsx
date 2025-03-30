"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package } from "lucide-react"
import { getOrders } from "../../services/acheteurService"
import AnimatedCard from "../../components/common/AnimatedCard"
import Button from "../../components/common/Button"
import LoadingScreen from "../../components/common/LoadingScreen"

interface Order {
  _id: string
  date_commande: string
  montant_total: number
  statut: string
  items: Array<{
    offre_id: {
      reference_id: {
        nom_produit?: string
        nom_materiel?: string
      }
    }
    quantite: number
  }>
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [currentPage])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await getOrders(currentPage)
      setOrders(data.commandes || [])
      setTotalPages(Math.ceil(data.total / data.par_page) || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading && currentPage === 1) {
    return <LoadingScreen />
  }

  return (
    <div className="py-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des commandes</h1>
          <p className="text-gray-600">Suivez l'état de vos commandes</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <AnimatedCard className="bg-white rounded-lg shadow-sm border p-8 text-center" delay={100}>
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune commande</h3>
          <p className="mt-1 text-gray-500">Vous n'avez pas encore passé de commande.</p>
          <Button to="/products" variant="primary" className="mt-4">
            Parcourir les produits
          </Button>
        </AnimatedCard>
      ) : (
        <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={100}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID Commande
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Articles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Montant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr key={order._id} className="slide-in" style={{ animationDelay: `${200 + index * 100}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date_commande)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} article(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.montant_total.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.statut,
                        )}`}
                      >
                        {order.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/orders/${order._id}`} className="text-primary hover:text-primary-dark">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === page
                          ? "bg-primary text-white border-primary z-10"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          )}
        </AnimatedCard>
      )}
    </div>
  )
}

export default OrderHistory

