"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, Tractor, TrendingUp, ArrowRight } from "lucide-react"
import { getOffers } from "../services/acheteurService"
import { useAuth } from "../contexts/AuthContext"
import Logo from "../components/common/Logo"
import AnimatedCard from "../components/common/AnimatedCard"
import Button from "../components/common/Button"

interface Offer {
  _id: string
  type_offre: string
  prix_unitaire: number
  quantite_disponible: number
  reference_id: {
    nom_produit?: string
    nom_materiel?: string
    photo?: string
  }
  vendeur_id: {
    prenom: string
    nom: string
  }
}

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers(1, "")
        setFeaturedOffers(data.offres.slice(0, 6))
      } catch (error) {
        console.error("Error fetching offers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOffers()
  }, [])

  return (
    <div className="py-6 fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl overflow-hidden shadow-xl mb-12 slide-in">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Connectez-vous directement aux agriculteurs locaux
            </h1>
            <p className="mt-4 text-lg text-white opacity-90">
              AgroConnect facilite l'achat et la vente de produits agricoles frais, sans intermédiaires.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    to="/register"
                    className="px-6 py-3 bg-white text-green-700 font-medium rounded-md shadow-md hover:bg-gray-100 transition-colors"
                  >
                    S'inscrire gratuitement
                  </Button>
                  <Button
                    to="/login"
                    variant="outline"
                    className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Se connecter
                  </Button>
                </>
              ) : user?.type_utilisateur === "acheteur" ? (
                <Button
                  to="/products"
                  className="px-6 py-3 bg-white text-green-700 font-medium rounded-md shadow-md hover:bg-gray-100 transition-colors"
                >
                  Parcourir les produits
                </Button>
              ) : (
                <Button
                  to="/agriculteur/offers/create"
                  className="px-6 py-3 bg-white text-green-700 font-medium rounded-md shadow-md hover:bg-gray-100 transition-colors"
                >
                  Créer une offre
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Logo className="w-64 h-64 text-white pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border text-center" delay={100}>
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pour les acheteurs</h3>
              <p className="text-gray-600">
                Achetez directement auprès des agriculteurs locaux. Produits frais, prix équitables.
              </p>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border text-center" delay={200}>
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tractor className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pour les agriculteurs</h3>
              <p className="text-gray-600">
                Vendez vos produits directement aux consommateurs. Augmentez vos marges, développez votre clientèle.
              </p>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm border text-center" delay={300}>
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pour l'économie locale</h3>
              <p className="text-gray-600">
                Soutenez l'agriculture locale et réduisez l'empreinte carbone avec des circuits courts.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Produits en vedette</h2>
            <Link to="/products" className="text-primary hover:text-primary-dark flex items-center">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse skeleton">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : featuredOffers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredOffers.map((offer, index) => (
                <AnimatedCard
                  key={offer._id}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  delay={100 * index}
                >
                  <Link to={`/products/${offer._id}`}>
                    <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden">
                      {offer.reference_id.photo ? (
                        <img
                          src={offer.reference_id.photo || "/placeholder.svg"}
                          alt={offer.reference_id.nom_produit || offer.reference_id.nom_materiel}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      {offer.reference_id.nom_produit || offer.reference_id.nom_materiel}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Vendeur: {offer.vendeur_id.prenom} {offer.vendeur_id.nom}
                    </p>
                    <p className="text-primary font-bold">{offer.prix_unitaire.toLocaleString()} FCFA</p>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-xl p-8 mb-12 slide-in" style={{ animationDelay: "400ms" }}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre AgroConnect?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous soyez agriculteur ou acheteur, AgroConnect vous offre une plateforme simple et efficace pour
            connecter l'offre et la demande de produits agricoles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!isAuthenticated ? (
              <>
                <Button to="/register" variant="primary" size="lg">
                  S'inscrire gratuitement
                </Button>
                <Button to="/login" variant="outline" size="lg">
                  Se connecter
                </Button>
              </>
            ) : user?.type_utilisateur === "acheteur" ? (
              <Button to="/products" variant="primary" size="lg">
                Parcourir les produits
              </Button>
            ) : (
              <Button to="/agriculteur/offers/create" variant="primary" size="lg">
                Créer une offre
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

