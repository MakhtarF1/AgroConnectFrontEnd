"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, ShoppingBag } from "lucide-react"
import { getProducts } from "../../services/acheteurService"
import AnimatedCard from "../../components/common/AnimatedCard"
import Button from "../../components/common/Button"
import LoadingScreen from "../../components/common/LoadingScreen"

interface Product {
  _id: string
  nom_produit: string
  description: string
  prix_unitaire: number
  quantite_disponible: number
  photo?: string
  vendeur_id: {
    prenom: string
    nom: string
  }
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await getProducts(currentPage, searchTerm)
      setProducts(data.produits || [])
      setTotalPages(Math.ceil(data.total / data.par_page) || 1)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  if (isLoading && currentPage === 1) {
    return <LoadingScreen />
  }

  return (
    <div className="py-6 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 slide-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits disponibles</h1>
          <p className="text-gray-600">Découvrez les produits frais de nos agriculteurs</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 slide-in" style={{ animationDelay: "100ms" }}>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Rechercher
            </Button>
            <Button type="button" variant="outline" className="inline-flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </form>
      </div>

      {products.length === 0 ? (
        <div
          className="bg-white rounded-lg shadow-sm border p-8 text-center slide-in"
          style={{ animationDelay: "200ms" }}
        >
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
          <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {products.map((product, index) => (
              <AnimatedCard
                key={product._id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
                delay={200 + index * 50}
              >
                <Link to={`/products/${product._id}`}>
                  <div className="h-48 bg-gray-200 relative">
                    {product.photo ? (
                      <img
                        src={product.photo || "/placeholder.svg"}
                        alt={product.nom_produit}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.nom_produit}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Vendeur: {product.vendeur_id.prenom} {product.vendeur_id.nom}
                    </p>
                    <p className="text-primary font-bold mt-2">{product.prix_unitaire.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.quantite_disponible > 0
                        ? `${product.quantite_disponible} disponibles`
                        : "Rupture de stock"}
                    </p>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 slide-in" style={{ animationDelay: "300ms" }}>
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
          )}
        </>
      )}
    </div>
  )
}

export default ProductList

