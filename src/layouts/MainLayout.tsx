"use client"

import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "../components/common/Navbar"
import Sidebar from "../components/common/Sidebar"
import Footer from "../components/common/Footer"
import { useAuth } from "../contexts/AuthContext"
import LoadingScreen from "../components/common/LoadingScreen"

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoading } = useAuth()

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pt-16 pb-16">
          <div className="container px-4 mx-auto">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default MainLayout

