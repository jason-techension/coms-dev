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
            message: 'Order baru #123 diterima',
            timestamp: new Date(),
            read: false,
            type: 'order'
        },
        {
            id: '2',
            message: 'Order #120 telah sampai di tujuan',
            timestamp: new Date(Date.now() - 3600000),
            read: false,
            type: 'order'
        },
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