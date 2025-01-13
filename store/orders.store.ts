import { ORDERS } from "@/constants/dummy";
import { Order } from "@/types/Order";
import { create } from "zustand";

interface OrderState{
    orders: Order[];
    loading: boolean;
    error: string;
    setOrders: (orders: Order[]) => void;
    addNewOrder: (order: Order) => void;
    deleteOrder: (orderId: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: ORDERS,
    loading: false,
    error: '',
    setOrders: (orders: Order[]) => set({ orders }),
    addNewOrder: (order: Order) => set((state) => ({ orders: [...state.orders, order] })),
    deleteOrder: (orderId: string) => set((state) => ({ orders: state.orders.filter(order => order.id !== orderId) })),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string) => set({ error })
}))