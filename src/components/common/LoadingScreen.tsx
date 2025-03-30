import type { FC } from "react"
import Logo from "./Logo"

const LoadingScreen: FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 fade-in">
      <Logo className="w-16 h-16 mb-4 pulse" />
      <span className="loader"></span>
      <p className="mt-4 text-lg font-medium text-gray-600 slide-in">Chargement...</p>
    </div>
  )
}

export default LoadingScreen

