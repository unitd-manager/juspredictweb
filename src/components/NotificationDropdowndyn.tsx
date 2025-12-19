"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "./ui/Button"
import { notificationApi, NotificationMessage } from "../api/notification"
/* -------------------------------------------------------------
   Component Props
------------------------------------------------------------- */

interface NotificationsDropdownProps {
  userId: string
  onClose: () => void
}

/* -------------------------------------------------------------
   Component
------------------------------------------------------------- */

const NotificationsDropdowndyn: React.FC<NotificationsDropdownProps> = ({
  userId,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  /* -------------------------------------------------------------
     Helpers
  ------------------------------------------------------------- */

  const isRead = (n: NotificationMessage) =>
    n.status === "READ"

  const formatTime = (iso?: string) => {
    if (!iso) return ""
    const date = new Date(iso)
    const diff = Date.now() - date.getTime()

    const min = Math.floor(diff / 60000)
    const hr = Math.floor(diff / 3600000)
    const day = Math.floor(diff / 86400000)

    if (min < 1) return "Just now"
    if (min < 60) return `${min}m ago`
    if (hr < 24) return `${hr}h ago`
    return `${day}d ago`
  }

  /* -------------------------------------------------------------
     API Calls
  ------------------------------------------------------------- */

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      const res = await notificationApi.getList({
        userId,
        includeRead: true,
        includeDeleted: false,
        includeArchived: false,
        limit: 20,
      })

      setNotifications(res.notifications ?? [])
    } catch (err) {
      console.error("Failed to fetch notifications", err)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.unreadCount({ userId })
      setUnreadCount(res.unreadCount ?? 0)
    } catch (err) {
      console.error("Failed to fetch unread count", err)
    }
  }

  const markSingleAsRead = async (messageId?: string) => {
    if (!messageId) return

    try {
      await notificationApi.update({
        userId,
        messageId,
        status: "READ",
      })

      setNotifications((prev) =>
        prev.map((n) =>
          n.messageId === messageId ? { ...n, status: "READ" } : n
        )
      )

      fetchUnreadCount()
    } catch (err) {
      console.error("Failed to mark notification as read", err)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => n.status === "UNREAD")
      .map((n) => n.messageId!)
      .filter(Boolean)

    if (unreadIds.length === 0) return

    try {
      await notificationApi.markMessages({
        userId,
        messageIds: unreadIds,
        status: "READ",
      })

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ" }))
      )

      setUnreadCount(0)
    } catch (err) {
      console.error("Failed to mark all as read", err)
    }
  }

  /* -------------------------------------------------------------
     Effects
  ------------------------------------------------------------- */

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  /* -------------------------------------------------------------
     Render
  ------------------------------------------------------------- */

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-black border border-border rounded-2xl shadow-lg z-50 max-h-[24rem] overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-medium text-white">Notifications</h5>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-400 text-xs"
              onClick={markAllAsRead}
            >
              Mark all
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-white"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p className="p-4 text-sm text-gray-400">Loading…</p>
      ) : notifications.length > 0 ? (
        notifications.map((n) => (
          <div
            key={n.messageId}
            className={`p-4 border-b border-border flex justify-between gap-3 transition-colors ${
              !isRead(n)
                ? "bg-green-500/10 hover:bg-green-500/20"
                : "hover:bg-gray-500/10"
            }`}
          >
            <div className="flex-1">
              <p
                className={`text-sm ${
                  !isRead(n)
                    ? "font-semibold text-white"
                    : "text-gray-300"
                }`}
              >
                {n.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTime(n.createdAt)}
              </p>
            </div>

            {!isRead(n) ? (
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-400 text-xs"
                onClick={() => markSingleAsRead(n.messageId)}
              >
                Mark as Read
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">✓ Read</span>
            )}
          </div>
        ))
      ) : (
        <p className="p-4 text-sm text-muted-foreground">
          No notifications.
        </p>
      )}
    </div>
  )
}

export default React.memo(NotificationsDropdowndyn)
