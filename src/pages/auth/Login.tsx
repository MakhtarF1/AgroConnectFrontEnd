"use client"

import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/common/Button"

const Login = () => {
  const [telephone, setTelephone] = useState("")
  const [mot_de_passe, setMotDePasse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(telephone, mot_de_passe)
    } catch (error: any) {
      setError(error.response?.data?.message || "Une erreur est survenue lors de la connexion")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md fade-in">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Connexion</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 slide-in">{error}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="slide-in" style={{ animationDelay: "100ms" }}>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ex: 771234567"
          />
        </div>

        <div className="slide-in" style={{ animationDelay: "200ms" }}>
          <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="mot_de_passe"
            name="mot_de_passe"
            type="password"
            required
            value={mot_de_passe}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-between slide-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
              Mot de passe oublié?
            </Link>
          </div>
        </div>

        <div className="slide-in" style={{ animationDelay: "400ms" }}>
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </div>
      </form>

      <div className="mt-6 slide-in" style={{ animationDelay: "500ms" }}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center slide-in" style={{ animationDelay: "600ms" }}>
        <p className="text-sm text-gray-600">
          Vous n'avez pas de compte?{" "}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

