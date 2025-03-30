"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/common/Button"

const Register = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    type_utilisateur: "acheteur",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsSubmitting(true)

    try {
      const { confirmer_mot_de_passe, ...registerData } = formData
      await register(registerData)
    } catch (error: any) {
      setError(error.response?.data?.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md fade-in">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Inscription</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 slide-in">{error}</div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 slide-in" style={{ animationDelay: "100ms" }}>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              required
              value={formData.prenom}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="slide-in" style={{ animationDelay: "200ms" }}>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
            value={formData.telephone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ex: 771234567"
          />
        </div>

        <div className="slide-in" style={{ animationDelay: "300ms" }}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (optionnel)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="slide-in" style={{ animationDelay: "400ms" }}>
          <label htmlFor="type_utilisateur" className="block text-sm font-medium text-gray-700">
            Type d'utilisateur
          </label>
          <select
            id="type_utilisateur"
            name="type_utilisateur"
            required
            value={formData.type_utilisateur}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="acheteur">Acheteur</option>
            <option value="agriculteur">Agriculteur</option>
          </select>
        </div>

        <div className="slide-in" style={{ animationDelay: "500ms" }}>
          <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            name="mot_de_passe"
            type="password"
            required
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="slide-in" style={{ animationDelay: "600ms" }}>
          <label htmlFor="confirmer_mot_de_passe" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmer_mot_de_passe"
            name="confirmer_mot_de_passe"
            type="password"
            required
            value={formData.confirmer_mot_de_passe}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="slide-in" style={{ animationDelay: "700ms" }}>
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center slide-in" style={{ animationDelay: "800ms" }}>
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

