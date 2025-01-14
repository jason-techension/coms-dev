export interface NotificationType {
    id: string
    message: string
    timestamp: Date
    read: boolean
    type: 'order' | 'system' | 'alert'
}