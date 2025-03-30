"use client"

import type { FC } from "react"
import { NavLink } from "react-router-dom"
import { X, Home, ShoppingBag, Package, Tractor, BarChart2, ShoppingCart, Settings } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import Logo from "./Logo"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, isAuthenticated } = useAuth()

  const commonLinks = [
    { to: "/", icon: <Home size={20} />, text: "Accueil" },
    { to: "/products", icon: <ShoppingBag size={20} />, text: "Produits" },
  ]

  const acheteurLinks = [
    { to: "/acheteur", icon: <BarChart2 size={20} />, text: "Tableau de bord" },
    { to: "/cart", icon: <ShoppingCart size={20} />, text: "Panier" },
    { to: "/orders", icon: <Package size={20} />, text: "Mes commandes" },
  ]

  const agriculteurLinks = [
    { to: "/agriculteur", icon: <BarChart2 size={20} />, text: "Tableau de bord" },
    { to: "/exploitations", icon: <Tractor size={20} />, text: "Exploitations" },
  ]

  const settingsLinks = [{ to: "/profile", icon: <Settings size={20} />, text: "Paramètres" }]

  const renderLinks = (links: { to: string; icon: JSX.Element; text: string }[]) => {
    return links.map((link, index) => (
      <li key={link.to} className="slide-in" style={{ animationDelay: `${index * 50}ms` }}>
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
            }`
          }
          end={link.to === "/" || link.to === "/acheteur" || link.to === "/agriculteur"}
        >
          <span className="mr-3">{link.icon}</span>
          {link.text}
        </NavLink>
      </li>
    ))
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden fade-in"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-primary">AgroConnect</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-8 fade-in">
          <ul className="space-y-1">{renderLinks(commonLinks)}</ul>

          {isAuthenticated && user?.type_utilisateur === "acheteur" && (
            <div className="fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acheteur</h3>
              <ul className="mt-2 space-y-1">{renderLinks(acheteurLinks)}</ul>
            </div>
          )}

          {isAuthenticated && user?.type_utilisateur === "agriculteur" && (
            <div className="fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agriculteur</h3>
              <ul className="mt-2 space-y-1">{renderLinks(agriculteurLinks)}</ul>
            </div>
          )}

          {isAuthenticated && (
            <div className="fade-in" style={{ animationDelay: "400ms" }}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paramètres</h3>
              <ul className="mt-2 space-y-1">{renderLinks(settingsLinks)}</ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

