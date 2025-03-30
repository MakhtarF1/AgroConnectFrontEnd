"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Tag, Plus, Search, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { getMyOffers, deleteOffer } from "../../services/agriculteurService"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"
import LoadingScreen from "../../components/common/LoadingScreen"
import toast from "react-hot-toast"

interface Offer {
  _id: string
  type_offre: string
  reference_id: {
    _id: string
    nom_produit?: string
    nom_materiel?: string
  }
  quantite_disponible: number
  prix_unitaire: number
  prix_gros?: number
  date_publication: string
  date_disponibilite?: string
  date_expiration?: string
  statut: string
  accepte_negociation: boolean
  accepte_paiement_echelonne: boolean
}

const OfferManagement = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setIsLoading(true)
      const data = await getMyOffers()
      setOffers(data)
    } catch (error) {
      console.error("Error fetching offers:", error)
      toast.error("Erreur lors du chargement des offres")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteOffer(id)
      setOffers(offers.filter((offer) => offer._id !== id))
      toast.success("Offre supprimée avec succès")
      setConfirmDelete(null)
    } catch (error) {
      console.error("Error deleting offer:", error)
      toast.error("Erreur lors de la suppression de l'offre")
    }
  }

  const getProductName = (offer: Offer) => {
    if (offer.type_offre === "produit agricole" && offer.reference_id.nom_produit) {
      return offer.reference_id.nom_produit
    } else if (offer.type_offre === "matériel" && offer.reference_id.nom_materiel) {
      return offer.reference_id.nom_materiel
    }
    return "Produit inconnu"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "épuisée":
        return "bg-yellow-100 text-yellow-800"
      case "expirée":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = getProductName(offer).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || offer.statut === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="py-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des offres</h1>
          <p className="text-gray-600">Gérez vos offres de vente</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button to="/agriculteur/offers/create" variant="primary" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6" delay={100}>
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Rechercher une offre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actives</option>
                <option value="épuisée">Épuisées</option>
                <option value="expirée">Expirées</option>
              </select>
            </div>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="p-6 text-center text-gray-500 slide-in" style={{ animationDelay: "200ms" }}>
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium">Aucune offre</p>
            <p className="mt-1">Ajoutez votre première offre pour commencer à vendre.</p>
            <Button to="/agriculteur/offers/create" variant="primary" className="mt-4">
              Ajouter une offre
            </Button>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-6 text-center text-gray-500 slide-in" style={{ animationDelay: "200ms" }}>
            <p className="text-lg font-medium">Aucun résultat trouvé</p>
            <p className="mt-1">Essayez avec un autre terme de recherche ou filtre</p>
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
                    Produit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prix
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantité
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date d'expiration
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
                {filteredOffers.map((offer, index) => (
                  <tr key={offer._id} className="slide-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{getProductName(offer)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.prix_unitaire.toLocaleString()} FCFA</div>
                      {offer.prix_gros && (
                        <div className="text-xs text-gray-500">Gros: {offer.prix_gros.toLocaleString()} FCFA</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{offer.quantite_disponible}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(offer.date_expiration)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(offer.statut)}`}
                      >
                        {offer.statut === "active" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {offer.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/agriculteur/offers/${offer._id}/edit`}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        {confirmDelete === offer._id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(offer._id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(offer._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedCard>
    </div>
  )
}

export default OfferManagement

