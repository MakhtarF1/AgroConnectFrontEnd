"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, MapPin, Phone, Check } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { createOrder, simulateOrangeMoney, simulateWave } from "../../services/acheteurService"
import Button from "../../components/common/Button"
import AnimatedCard from "../../components/common/AnimatedCard"
import LoadingScreen from "../../components/common/LoadingScreen"
import toast from "react-hot-toast"

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    adresse_livraison: user?.localisation?.adresse || "",
    telephone_livraison: user?.telephone || "",
    instructions_livraison: "",
    methode_paiement: "orange_money",
    numero_paiement: user?.telephone || "",
  })

  if (items.length === 0) {
    navigate("/cart")
    return <LoadingScreen />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Créer la commande
      const orderData = {
        adresse_livraison: formData.adresse_livraison,
        telephone_livraison: formData.telephone_livraison,
        instructions_livraison: formData.instructions_livraison,
        methode_paiement: formData.methode_paiement,
        items: items.map((item) => ({
          offre_id: item.offre_id,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
        })),
      }

      const orderResponse = await createOrder(orderData)

      // Simuler le paiement selon la méthode choisie
      const paymentData = {
        commande_id: orderResponse._id,
        montant: totalPrice,
        numero: formData.numero_paiement,
      }

      if (formData.methode_paiement === "orange_money") {
        await simulateOrangeMoney(paymentData)
      } else if (formData.methode_paiement === "wave") {
        await simulateWave(paymentData)
      }

      // Vider le panier et rediriger vers la page de confirmation
      clearCart()
      toast.success("Commande passée avec succès!")
      navigate(`/orders/${orderResponse._id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Erreur lors de la création de la commande")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.adresse_livraison || !formData.telephone_livraison)) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="py-6 fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 slide-in">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6" delay={100}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Étapes de la commande</h2>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <div className={`w-10 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>
            </div>

            {step === 1 && (
              <form className="p-6 slide-in">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de livraison</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="adresse_livraison" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse de livraison <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="adresse_livraison"
                        name="adresse_livraison"
                        value={formData.adresse_livraison}
                        onChange={handleChange}
                        required
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telephone_livraison" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone de contact <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="telephone_livraison"
                        name="telephone_livraison"
                        value={formData.telephone_livraison}
                        onChange={handleChange}
                        required
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instructions_livraison" className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions de livraison (optionnel)
                    </label>
                    <textarea
                      id="instructions_livraison"
                      name="instructions_livraison"
                      value={formData.instructions_livraison}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Précisions sur l'adresse, horaires préférés, etc."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="button" variant="primary" onClick={nextStep}>
                    Continuer vers le paiement
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="p-6 slide-in" onSubmit={handleSubmit}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionnez une méthode de paiement
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="methode_paiement"
                          value="orange_money"
                          checked={formData.methode_paiement === "orange_money"}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 flex items-center">
                          <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
                          Orange Money
                        </span>
                      </label>

                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="methode_paiement"
                          value="wave"
                          checked={formData.methode_paiement === "wave"}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 flex items-center">
                          <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                          Wave
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="numero_paiement" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro de téléphone pour le paiement <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="numero_paiement"
                        name="numero_paiement"
                        value={formData.numero_paiement}
                        onChange={handleChange}
                        required
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Vous recevrez une notification pour confirmer le paiement
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Retour
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
                  </Button>
                </div>
              </form>
            )}
          </AnimatedCard>
        </div>

        <div className="lg:col-span-1">
          <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-20" delay={300}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Résumé de la commande</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Articles ({items.length})</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.offre_id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.nom_produit} x {item.quantite}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {(item.prix_unitaire * item.quantite).toLocaleString()} FCFA
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900 font-medium">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="text-gray-900 font-medium">À calculer</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Paiement sécurisé</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Vos informations de paiement sont sécurisées.</p>
                      </div>
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

export default Checkout
