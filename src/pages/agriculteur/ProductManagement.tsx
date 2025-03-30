"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, Plus, Search, Edit, Trash2 } from "lucide-react"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"
import LoadingScreen from "../../components/common/LoadingScreen"
import toast from "react-hot-toast"
import { getCategories } from "@/services/agriculteurService"

interface Product {
  _id: string
  nom_produit: string
  description: string
  unite_mesure: string
  categorie_id: {
    _id: string
    nom: string
  }
  photo?: string
  type_produit: string
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ _id: string; nom: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
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
          categorie_id: {
            _id: "cat1",
            nom: "Céréales",
          },
          photo: "/placeholder.svg?height=200&width=200",
          type_produit: "frais",
        },
        {
          _id: "2",
          nom_produit: "Arachide",
          description: "Arachides fraîches non décortiquées",
          unite_mesure: "kg",
          categorie_id: {
            _id: "cat2",
            nom: "Légumineuses",
          },
          photo: "/placeholder.svg?height=200&width=200",
          type_produit: "frais",
        },
        {
          _id: "3",
          nom_produit: "Mil",
          description: "Mil de qualité pour la consommation",
          unite_mesure: "kg",
          categorie_id: {
            _id: "cat1",
            nom: "Céréales",
          },
          photo: "/placeholder.svg?height=200&width=200",
          type_produit: "frais",
        },
      ]
      setProducts(mockProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Erreur lors du chargement des produits")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // This would be replaced with a real API call to delete the product
      setProducts(products.filter((product) => product._id !== id))
      toast.success("Produit supprimé avec succès")
      setConfirmDelete(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Erreur lors de la suppression du produit")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nom_produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory ? product.categorie_id._id === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="py-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
          <p className="text-gray-600">Gérez vos produits agricoles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button to="/agriculteur/products/create" variant="primary" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6" delay={100}>
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2 relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500 slide-in" style={{ animationDelay: "200ms" }}>
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium">Aucun produit</p>
            <p className="mt-1">Ajoutez votre premier produit pour commencer.</p>
            <Button to="/agriculteur/products/create" variant="primary" className="mt-4">
              Ajouter un produit
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 slide-in" style={{ animationDelay: "200ms" }}>
            <p className="text-lg font-medium">Aucun résultat trouvé</p>
            <p className="mt-1">Essayez avec un autre terme de recherche</p>
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
                    Catégorie
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Unité
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
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
                {filteredProducts.map((product, index) => (
                  <tr key={product._id} className="slide-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-4">
                          {product.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.photo || "/placeholder.svg"}
                              alt={product.nom_produit}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.nom_produit}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.categorie_id.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.unite_mesure}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.type_produit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/agriculteur/products/${product._id}/edit`}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        {confirmDelete === product._id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(product._id)}
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
                            onClick={() => setConfirmDelete(product._id)}
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

export default ProductManagement

