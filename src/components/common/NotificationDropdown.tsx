"use client"

import { type FC, useEffect, useRef } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { useNotifications } from "../../contexts/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface NotificationDropdownProps {
  onClose: () => void
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, isLoading, fetchNotifications } =
    useNotifications()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, fetchNotifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "commande":
        return <Bell size={16} className="text-blue-500" />
      case "paiement":
        return <Bell size={16} className="text-green-500" />
      case "livraison":
        return <Bell size={16} className="text-yellow-500" />
      case "message":
        return <Bell size={16} className="text-purple-500" />
      case "système":
        return <Bell size={16} className="text-red-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr })
    } catch (error) {
      return "Date inconnue"
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border max-h-96 overflow-y-auto scale-in"
    >
      <div className="px-4 py-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary-dark transition-colors">
          Tout marquer comme lu
        </button>
      </div>

      {isLoading ? (
        <div className="px-4 py-8 text-center text-gray-500">
          <span className="loader"></span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 fade-in">
          <Bell size={24} className="mx-auto mb-2 text-gray-400" />
          <p>Aucune notification</p>
        </div>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={notification._id}
            className={`px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors slide-in ${
              notification.statut === "non lue" ? "bg-blue-50" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.titre}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.contenu}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatDate(notification.date_creation)}</span>
                  <div className="flex space-x-2">
                    {notification.statut === "non lue" && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs text-primary hover:text-primary-dark transition-colors"
                        title="Marquer comme lu"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default NotificationDropdown

