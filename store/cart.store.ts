import { OrderItems } from "@/types/Order";
import { create } from "zustand";

interface CartStore{
    selectedItems: OrderItems[];
    total: number;
    addItem: (item: OrderItems) => void;
    removeItem: (itemId: string) => void;
    checkout: () => void;
    showPaymentModal: boolean;
    paymentStatus: string;
    setShowPaymentModal: (show: boolean) => void;
    setPaymentStatus: (status: string) => void;
    resetCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    selectedItems: [],
    total: 0,
    addItem: (item:OrderItems) => set((state) => ({
        selectedItems: [...state.selectedItems, item],
        total: state.total + item.product.price * item.quantity
    })),
    removeItem: (itemId) => set((state) => {
        const itemToRemove = state.selectedItems.find(item => item.id === itemId);
        if (!itemToRemove) return state; // If item not found, return current state
    
        return {
            selectedItems: state.selectedItems.filter(item => item.id !== itemId),
            total: state.total - (itemToRemove.product.price * itemToRemove.quantity)
        };
    }),
    resetCart: () => set({ selectedItems: [], total: 0 }),
    checkout: () => set({ selectedItems: [], total: 0 }),
    showPaymentModal: false,
    paymentStatus: '',
    setShowPaymentModal: (show) => set({ showPaymentModal: show }),
    setPaymentStatus: (status) => set({ paymentStatus: status })
}))