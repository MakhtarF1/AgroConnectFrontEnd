"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/common/Button"
import AnimatedCard from "../components/common/AnimatedCard"
import LoadingScreen from "../components/common/LoadingScreen"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || "",
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        adresse: user.localisation?.adresse || "",
      })
    }
  }, [user])

  if (isLoading) {
    return <LoadingScreen />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const updateData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        localisation: {
          adresse: formData.adresse,
        },
      }

      await updateProfile(updateData)
      setMessage({ type: "success", text: "Profil mis à jour avec succès" })
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du profil" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-6 fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 slide-in">Mon Profil</h1>

      <AnimatedCard className="bg-white rounded-lg shadow-sm border overflow-hidden" delay={100}>
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Informations personnelles</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="slide-in" style={{ animationDelay: "200ms" }}>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="slide-in" style={{ animationDelay: "300ms" }}>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="slide-in" style={{ animationDelay: "400ms" }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="slide-in" style={{ animationDelay: "500ms" }}>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  disabled
                  className="pl-10 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Le numéro de téléphone ne peut pas être modifié</p>
            </div>

            <div className="slide-in md:col-span-2" style={{ animationDelay: "600ms" }}>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end slide-in" style={{ animationDelay: "700ms" }}>
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </AnimatedCard>
    </div>
  )
}

export default Profile
