import type { FC } from "react"
import { Link } from "react-router-dom"
import Logo from "./Logo"

const Footer: FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-primary">AgroConnect</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
            <Link to="/products" className="hover:text-primary">
              Produits
            </Link>
            <Link to="/about" className="hover:text-primary">
              À propos
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AgroConnect. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

