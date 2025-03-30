import Button from "../components/common/Button"

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page non trouvée</h2>
        <p className="text-lg text-gray-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Button to="/" variant="primary" size="lg" className="slide-in">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}

export default NotFound

