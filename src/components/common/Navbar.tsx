"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Bell, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useNotifications } from "../../contexts/NotificationContext"
import Logo from "./Logo"
import NotificationDropdown from "./NotificationDropdown"
import Button from "./Button"

interface NavbarProps {
  onMenuButtonClick: () => void
}

const Navbar = ({ onMenuButtonClick }: NavbarProps) => {
  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount } = useNotifications()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuButtonClick}
              className="p-1 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-primary">AgroConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen)
                      setUserMenuOpen(false)
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full scale-in">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && <NotificationDropdown onClose={() => setNotificationsOpen(false)} />}
                </div>

                {user?.type_utilisateur === "acheteur" && (
                  <Link
                    to="/cart"
                    className="p-1 relative rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    aria-label="Cart"
                  >
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full scale-in">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen)
                      setNotificationsOpen(false)
                    }}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.photo_profil ? (
                        <img
                          src={user.photo_profil || "/placeholder.svg"}
                          alt={`${user.prenom} ${user.nom}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.prenom} {user?.nom}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border scale-in">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {user?.prenom} {user?.nom}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email || user?.telephone}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profil
                      </Link>
                      {user?.type_utilisateur === "agriculteur" && (
                        <Link
                          to="/agriculteur"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Tableau de bord
                        </Link>
                      )}
                      {user?.type_utilisateur === "acheteur" && (
                        <Link
                          to="/acheteur"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Tableau de bord
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Button to="/login" variant="ghost" size="sm">
                  Connexion
                </Button>
                <Button to="/register" variant="primary" size="sm">
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

