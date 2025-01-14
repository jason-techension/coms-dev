import { NotificationType } from "@/types/Notification"
import { create } from "zustand"

interface NotificationStore {
    notifications: NotificationType[]
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    addNotification: (notification: Omit<NotificationType, 'id' | 'read'>) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [
        {
            id: '1',
            message: 'New order #123 received',
            timestamp: new Date(),
            read: false,
            type: 'order'
        },
        {
            id: '2',
            message: 'Order #120 has been completed',
            timestamp: new Date(Date.now() - 3600000),
            read: false,
            type: 'order'
        },
        {
            id: '3',
            message: 'System maintenance scheduled',
            timestamp: new Date(Date.now() - 7200000),
            read: true,
            type: 'system'
        }
    ],
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        )
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true
        }))
    })),
    addNotification: (notification) => set((state) => ({
        notifications: [{
            ...notification,
            id: crypto.randomUUID(),
            read: false
        }, ...state.notifications]
    }))
}))