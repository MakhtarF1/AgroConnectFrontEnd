"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { createOffer } from "../../services/agriculteurService"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"
import LoadingScreen from "../../components/common/LoadingScreen"
import toast from "react-hot-toast"

interface Product {
  _id: string
  nom_produit: string
  description: string
  unite_mesure: string
}

const CreateOffer = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    type_offre: "produit agricole",
    reference_id: "",
    quantite_disponible: 0,
    prix_unitaire: 0,
    prix_gros: 0,
    localisation_produit: {
      adresse: "",
      coordonnees_gps: {
        latitude: 0,
        longitude: 0,
      },
    },
    date_disponibilite: "",
    date_expiration: "",
    modes_livraison_disponibles: ["retrait sur place"],
    accepte_negociation: true,
    accepte_paiement_echelonne: false,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      // This would be replaced with a real API call to get the farmer's products
      // For now, we'll use mock data
      const mockProducts: Product[] = [
        {
          _id: "1",
          nom_produit: "Maïs",
          description: "Maïs frais de qualité supérieure",
          unite_mesure: "kg",
        },
        {
          _id: "2",
          nom_produit: "Arachide",
          description: "Arachides fraîches non décortiquées",
          unite_mesure: "kg",
        },
        {
          _id: "3",
          nom_produit: "Mil",
          description: "Mil de qualité pour la consommation",
          unite_mesure: "kg",
        },
      ]
      setProducts(mockProducts)
      if (mockProducts.length > 0) {
        setFormData((prev) => ({ ...prev, reference_id: mockProducts[0]._id }))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Erreur lors du chargement des produits")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.includes("localisation_produit.adresse")) {
      setFormData((prev) => ({
        ...prev,
        localisation_produit: {
          ...prev.localisation_produit,
          adresse: value,
        },
      }))
    } else if (name.includes("coordonnees_gps.")) {
      const [_, coord] = name.split("coordonnees_gps.")
      setFormData((prev) => ({
        ...prev,
        localisation_produit: {
          ...prev.localisation_produit,
          coordonnees_gps: {
            ...prev.localisation_produit.coordonnees_gps,
            [coord]: Number.parseFloat(value) || 0,
          },
        },
      }))
    } else if (name === "accepte_negociation" || name === "accepte_paiement_echelonne") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleLivraisonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        modes_livraison_disponibles: [...prev.modes_livraison_disponibles, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        modes_livraison_disponibles: prev.modes_livraison_disponibles.filter((mode) => mode !== value),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createOffer(formData)
      toast.success("Offre créée avec succès")
      navigate("/agriculteur/offers")
    } catch (error) {
      console.error("Error creating offer:", error)
      toast.error("Erreur lors de la création de l'offre")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            localisation_produit: {
              ...prev.localisation_produit,
              coordonnees_gps: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            },
          }))
          toast.success("Position actuelle récupérée")
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Impossible de récupérer votre position")
        },
      )
    } else {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur")
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="py-6 fade-in">
      <div className="mb-6 slide-in">
        <Link to="/agriculteur/offers" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux offres
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 slide-in" style={{ animationDelay: "100ms" }}>
        Créer une nouvelle offre
      </h1>

      <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={200}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="type_offre" className="block text-sm font-medium text-gray-700 mb-1">
                Type d'offre <span className="text-red-500">*</span>
              </label>
              <select
                id="type_offre"
                name="type_offre"
                value={formData.type_offre}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="produit agricole">Produit agricole</option>
                <option value="produit transformé">Produit transformé</option>
                <option value="matériel">Matériel agricole</option>
              </select>
            </div>

            <div>
              <label htmlFor="reference_id" className="block text-sm font-medium text-gray-700 mb-1">
                Produit <span className="text-red-500">*</span>
              </label>
              <select
                id="reference_id"
                name="reference_id"
                value={formData.reference_id}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.nom_produit} ({product.unite_mesure})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantite_disponible" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantite_disponible"
                name="quantite_disponible"
                value={formData.quantite_disponible}
                onChange={handleChange}
                required
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="prix_unitaire" className="block text-sm font-medium text-gray-700 mb-1">
                Prix unitaire (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="prix_unitaire"
                name="prix_unitaire"
                value={formData.prix_unitaire}
                onChange={handleChange}
                required
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="prix_gros" className="block text-sm font-medium text-gray-700 mb-1">
                Prix en gros (FCFA)
              </label>
              <input
                type="number"
                id="prix_gros"
                name="prix_gros"
                value={formData.prix_gros}
                onChange={handleChange}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500">Laissez vide si vous n'offrez pas de prix en gros</p>
            </div>

            <div>
              <label htmlFor="localisation_produit.adresse" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse de stockage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="localisation_produit.adresse"
                name="localisation_produit.adresse"
                value={formData.localisation_produit.adresse}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="coordonnees_gps.latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                id="coordonnees_gps.latitude"
                name="coordonnees_gps.latitude"
                value={formData.localisation_produit.coordonnees_gps.latitude}
                onChange={handleChange}
                step="any"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="coordonnees_gps.longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="coordonnees_gps.longitude"
                  name="coordonnees_gps.longitude"
                  value={formData.localisation_produit.coordonnees_gps.longitude}
                  onChange={handleChange}
                  step="any"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
                <Button type="button" variant="outline" onClick={getCurrentLocation} className="whitespace-nowrap">
                  Position actuelle
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="date_disponibilite" className="block text-sm font-medium text-gray-700 mb-1">
                Date de disponibilité
              </label>
              <input
                type="date"
                id="date_disponibilite"
                name="date_disponibilite"
                value={formData.date_disponibilite}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="date_expiration" className="block text-sm font-medium text-gray-700 mb-1">
                Date d'expiration
              </label>
              <input
                type="date"
                id="date_expiration"
                name="date_expiration"
                value={formData.date_expiration}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Modes de livraison disponibles</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="retrait_sur_place"
                    name="modes_livraison_disponibles"
                    type="checkbox"
                    value="retrait sur place"
                    checked={formData.modes_livraison_disponibles.includes("retrait sur place")}
                    onChange={handleLivraisonChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="retrait_sur_place" className="ml-2 block text-sm text-gray-900">
                    Retrait sur place
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="livraison_locale"
                    name="modes_livraison_disponibles"
                    type="checkbox"
                    value="livraison locale"
                    checked={formData.modes_livraison_disponibles.includes("livraison locale")}
                    onChange={handleLivraisonChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="livraison_locale" className="ml-2 block text-sm text-gray-900">
                    Livraison locale
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="livraison_nationale"
                    name="modes_livraison_disponibles"
                    type="checkbox"
                    value="livraison nationale"
                    checked={formData.modes_livraison_disponibles.includes("livraison nationale")}
                    onChange={handleLivraisonChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="livraison_nationale" className="ml-2 block text-sm text-gray-900">
                    Livraison nationale
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="accepte_negociation"
                  name="accepte_negociation"
                  type="checkbox"
                  checked={formData.accepte_negociation}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="accepte_negociation" className="ml-2 block text-sm text-gray-900">
                  Accepte la négociation de prix
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="accepte_paiement_echelonne"
                  name="accepte_paiement_echelonne"
                  type="checkbox"
                  checked={formData.accepte_paiement_echelonne}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="accepte_paiement_echelonne" className="ml-2 block text-sm text-gray-900">
                  Accepte le paiement échelonné
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate("/agriculteur/offers")}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer l'offre"}
            </Button>
          </div>
        </form>
      </AnimatedCard>
    </div>
  )
}

export default CreateOffer

