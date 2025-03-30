"use client"

import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [telephone, setTelephone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error: any) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Instructions envoyées</h2>
          <p className="text-gray-600 mb-4">
            Si un compte est associé au numéro {telephone}, vous recevrez un SMS avec les instructions pour
            réinitialiser votre mot de passe.
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
      <p className="text-center text-gray-600 mb-6">
        Entrez votre numéro de téléphone et nous vous enverrons un SMS avec les instructions pour réinitialiser votre
        mot de passe.
      </p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
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

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer les instructions"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword

