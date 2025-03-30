"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import api from "../services/api"
import { useAuth } from "./AuthContext"

interface Notification {
  _id: string
  titre: string
  contenu: string
  type: string
  date_creation: string
  statut: "lue" | "non lue"
  reference?: {
    type: string
    id: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  isLoading: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      const interval = setInterval(fetchUnreadCount, 60000) // Check for new notifications every minute
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const fetchNotifications = async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const { data } = await api.get("/notifications")
      setNotifications(data.notifications)
      setUnreadCount(data.unread)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return

    try {
      const { data } = await api.get("/notifications/unread-count")
      setUnreadCount(data.count)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, statut: "lue" } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all")
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, statut: "lue" })),
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      const updatedNotifications = notifications.filter((notification) => notification._id !== id)
      setNotifications(updatedNotifications)

      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find((notification) => notification._id === id)
      if (deletedNotification && deletedNotification.statut === "non lue") {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

