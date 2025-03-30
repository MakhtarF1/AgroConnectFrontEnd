"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getCategories, createProduit } from "../../services/produitsController"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"
import toast from "react-hot-toast"

interface Category {
  _id: string
  nom: string
}

const CreateProduct = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    categorie_id: "",
    nom_produit: "",
    nom_local: {
      wolof: "",
      pulaar: "",
      serere: "",
    },
    description: "",
    unite_mesure: "kg",
    saison_disponibilite: {
      debut: "",
      pic: "",
      fin: "",
    },
    photo: "",
    duree_conservation: 0,
    conseils_stockage: "",
    type_produit: "frais",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, categorie_id: data[0]._id }))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Erreur lors du chargement des catégories")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.includes("nom_local.")) {
      const [_, lang] = name.split("nom_local.")
      setFormData((prev) => ({
        ...prev,
        nom_local: {
          ...prev.nom_local,
          [lang]: value,
        },
      }))
    } else if (name.includes("saison_disponibilite.")) {
      const [_, period] = name.split("saison_disponibilite.")
      setFormData((prev) => ({
        ...prev,
        saison_disponibilite: {
          ...prev.saison_disponibilite,
          [period]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await createProduit(formData)
      toast.success("Produit créé avec succès")
      navigate("/agriculteur/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Erreur lors de la création du produit")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-6 fade-in">
      <div className="mb-6 slide-in">
        <Link to="/agriculteur/products" className="inline-flex items-center text-primary hover:text-primary-dark">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 slide-in" style={{ animationDelay: "100ms" }}>
        Créer un nouveau produit
      </h1>

      <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={200}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="nom_produit" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nom_produit"
                name="nom_produit"
                value={formData.nom_produit}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="categorie_id"
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type_produit" className="block text-sm font-medium text-gray-700 mb-1">
                Type de produit <span className="text-red-500">*</span>
              </label>
              <select
                id="type_produit"
                name="type_produit"
                value={formData.type_produit}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="frais">Frais</option>
                <option value="transformé">Transformé</option>
                <option value="semence">Semence</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label htmlFor="unite_mesure" className="block text-sm font-medium text-gray-700 mb-1">
                Unité de mesure <span className="text-red-500">*</span>
              </label>
              <select
                id="unite_mesure"
                name="unite_mesure"
                value={formData.unite_mesure}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="kg">Kilogramme (kg)</option>
                <option value="g">Gramme (g)</option>
                <option value="t">Tonne (t)</option>
                <option value="l">Litre (l)</option>
                <option value="unité">Unité</option>
                <option value="sac">Sac</option>
                <option value="caisse">Caisse</option>
              </select>
            </div>

            <div>
              <label htmlFor="duree_conservation" className="block text-sm font-medium text-gray-700 mb-1">
                Durée de conservation (jours)
              </label>
              <input
                type="number"
                id="duree_conservation"
                name="duree_conservation"
                value={formData.duree_conservation}
                onChange={handleChange}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="conseils_stockage" className="block text-sm font-medium text-gray-700 mb-1">
                Conseils de stockage
              </label>
              <textarea
                id="conseils_stockage"
                name="conseils_stockage"
                value={formData.conseils_stockage}
                onChange={handleChange}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label htmlFor="nom_local.wolof" className="block text-sm font-medium text-gray-700 mb-1">
                Nom en Wolof
              </label>
              <input
                type="text"
                id="nom_local.wolof"
                name="nom_local.wolof"
                value={formData.nom_local.wolof}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="nom_local.pulaar" className="block text-sm font-medium text-gray-700 mb-1">
                Nom en Pulaar
              </label>
              <input
                type="text"
                id="nom_local.pulaar"
                name="nom_local.pulaar"
                value={formData.nom_local.pulaar}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="nom_local.serere" className="block text-sm font-medium text-gray-700 mb-1">
                Nom en Sérère
              </label>
              <input
                type="text"
                id="nom_local.serere"
                name="nom_local.serere"
                value={formData.nom_local.serere}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="saison_disponibilite.debut" className="block text-sm font-medium text-gray-700 mb-1">
                Début de saison
              </label>
              <input
                type="date"
                id="saison_disponibilite.debut"
                name="saison_disponibilite.debut"
                value={formData.saison_disponibilite.debut}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="saison_disponibilite.pic" className="block text-sm font-medium text-gray-700 mb-1">
                Pic de saison
              </label>
              <input
                type="date"
                id="saison_disponibilite.pic"
                name="saison_disponibilite.pic"
                value={formData.saison_disponibilite.pic}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="saison_disponibilite.fin" className="block text-sm font-medium text-gray-700 mb-1">
                Fin de saison
              </label>
              <input
                type="date"
                id="saison_disponibilite.fin"
                name="saison_disponibilite.fin"
                value={formData.saison_disponibilite.fin}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate("/agriculteur/products")}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer le produit"}
            </Button>
          </div>
        </form>
      </AnimatedCard>
    </div>
  )
}

export default CreateProduct

