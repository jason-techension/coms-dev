"use client";

import { useNotificationStore } from "@/store/notifications.store"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export default function NotificationBell() {
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
    const [isOpen, setIsOpen] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days} hari yang lalu`
        if (hours > 0) return `${hours} jam yang lalu`
        if (minutes > 0) return `${minutes} menit yang lalu`
        return 'Baru saja'
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                markAllAsRead()
                                setIsOpen(false)
                            }}
                        >
                            Tandai terbaca semua
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`px-4 py-2 cursor-pointer ${!notification.read ? 'bg-slate-50' : ''}`}
                                onClick={() => {
                                    markAsRead(notification.id)
                                    setIsOpen(false)
                                }}
                            >
                                <div className="space-y-1">
                                    <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatTimestamp(new Date(notification.timestamp))}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                            No notifications
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}