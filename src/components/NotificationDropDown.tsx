"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "./ui/Button"

export interface Notification {
  notificationId: string
  notificationMessage: string
  isRead?: boolean
  timestamp?: Date
}

interface NotificationsDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClose: () => void
}

const dummyNotifications: Notification[] = [
  {
    notificationId: "1",
    notificationMessage: "Your order has been shipped!",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    notificationId: "2",
    notificationMessage: "Welcome to our platform.",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    notificationId: "3",
    notificationMessage: "New feature available: Dark mode.",
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    notificationId: "4",
    notificationMessage: "Payment received successfully.",
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications: propNotifications,
  onMarkAsRead,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Use dummy notifications if none provided
    const finalNotifications =
      propNotifications.length === 0 ? dummyNotifications : propNotifications
    // Ensure all have timestamp and isRead
    const enriched = finalNotifications.map((n) => ({
      ...n,
      isRead: n.isRead ?? false,
      timestamp: n.timestamp ?? new Date(),
    }))
    setNotifications(enriched)
  }, [propNotifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-black border border-border rounded-2xl shadow-lg z-50 max-h-[24rem] overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-black">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-medium text-white">Notifications</h5>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="shrink-0 text-white"
          aria-label="Close notifications"
        >
          ✕
        </Button>
      </div>

      {/* Body */}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.notificationId}
            className={`p-4 border-b border-border flex justify-between items-start gap-3 transition-colors rounded-xl ${
              !notification.isRead
                ? "bg-green-500/10 hover:bg-green-500/20"
                : "hover:bg-gray-500/10"
            }`}
          >
            <div className="flex-1">
              <p
                className={`text-sm leading-snug ${
                  !notification.isRead ? "font-semibold text-white" : "text-gray-300"
                }`}
              >
                {notification.notificationMessage}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTime(notification.timestamp!)}
              </p>
            </div>

            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.notificationId)}
                className="shrink-0 text-blue-400 hover:text-blue-300"
              >
                Mark as Read
              </Button>
            )}
            {notification.isRead && (
              <span className="text-xs text-muted-foreground shrink-0">✓ Read</span>
            )}
          </div>
        ))
      ) : (
        <p className="p-4 text-sm text-muted-foreground">
          No new notifications.
        </p>
      )}
    </div>
  )
}

export default React.memo(NotificationsDropdown)
