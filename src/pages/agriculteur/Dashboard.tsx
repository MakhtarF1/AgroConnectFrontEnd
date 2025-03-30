"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Tractor, Package, TrendingUp, Plus, Leaf } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { getFarmerStatistics, getExploitations, getSellerOrders } from "../../services/agriculteurService"
import LoadingScreen from "../../components/common/LoadingScreen"
import AnimatedCard from "../../components/common/AnimatedCard"
import Button from "../../components/common/Button"

interface Exploitation {
  _id: string
  nom_exploitation: string
  superficie: number
  cultures_principales: string[]
}

interface Order {
  _id: string
  date_commande: string
  montant_total: number
  statut: string
  acheteur_id: {
    prenom: string
    nom: string
  }
}

const Dashboard = () => {
  const { user } = useAuth()
  const [exploitations, setExploitations] = useState<Exploitation[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total_exploitations: 0,
    total_superficie: 0,
    total_ventes: 0,
    total_revenus: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, exploitationsData, ordersData] = await Promise.all([
          getFarmerStatistics(),
          getExploitations(),
          getSellerOrders(),
        ])

        setStats({
          ...statsData,
          total_ventes: ordersData.total || 0,
          total_revenus: ordersData.commandes.reduce((sum: number, order: Order) => sum + order.montant_total, 0),
        })

        setExploitations(exploitationsData.slice(0, 3))
        setRecentOrders(ordersData.commandes.slice(0, 5))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
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

  return (
    <div className="py-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Agriculteur</h1>
          <p className="text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button to="/exploitations/create" variant="primary" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle exploitation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border" delay={100}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Tractor className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Exploitations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_exploitations}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border" delay={200}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Superficie totale</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_superficie} ha</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border" delay={300}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ventes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_ventes}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border" delay={400}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenus</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_revenus.toLocaleString()} FCFA</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={500}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Mes exploitations</h2>
            <Link to="/exploitations" className="text-sm font-medium text-primary hover:text-primary-dark">
              Voir tout
            </Link>
          </div>

          {exploitations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Tractor className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-lg font-medium">Aucune exploitation</p>
              <p className="mt-1">Ajoutez votre première exploitation pour commencer.</p>
              <Button to="/exploitations/create" variant="primary" className="mt-4">
                Ajouter une exploitation
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {exploitations.map((exploitation, index) => (
                <div
                  key={exploitation._id}
                  className="p-6 slide-in"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{exploitation.nom_exploitation}</h3>
                      <p className="text-sm text-gray-500">Superficie: {exploitation.superficie} hectares</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exploitation.cultures_principales.map((culture, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {culture}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to={`/exploitations/${exploitation._id}`}
                      className="text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedCard>

        <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={600}>
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Commandes récentes</h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-lg font-medium">Aucune commande récente</p>
              <p className="mt-1">Les commandes de vos produits apparaîtront ici.</p>
              <Button to="/agriculteur/offers/create" variant="primary" className="mt-4">
                Créer une offre
              </Button>
            </div>
          ) : (
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
                      Acheteur
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
                      Montant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order, index) => (
                    <tr key={order._id} className="slide-in" style={{ animationDelay: `${700 + index * 100}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/agriculteur/orders/${order._id}`} className="text-primary hover:text-primary-dark">
                          {order._id.substring(order._id.length - 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.acheteur_id.prenom} {order.acheteur_id.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date_commande)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.montant_total.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.statut)}`}
                        >
                          {order.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {recentOrders.length > 0 && (
            <div className="px-6 py-4 border-t">
              <Link to="/agriculteur/orders" className="text-sm font-medium text-primary hover:text-primary-dark">
                Voir toutes les commandes
              </Link>
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  )
}

export default Dashboard

