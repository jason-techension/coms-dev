"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from "@/store/cart.store"

export function CartDropdown() {
    const { selectedItems, total, removeItem, setShowPaymentModal, setPaymentStatus } = useCartStore();
    const [isOpen, setIsOpen] = useState(false)

    const onCheckout = () => {
        setShowPaymentModal(true)
        setPaymentStatus('pending')
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {selectedItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {selectedItems.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 space-y-4">
                    <h3 className="font-semibold">Keranjang Belanja</h3>
                    {selectedItems.length === 0 ? (
                        <p className="text-sm text-gray-500">Keranjang kosong</p>
                    ) : (
                        <>
                            {selectedItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => {
                                onCheckout()
                                setIsOpen(false)
                            }}>
                                Lakukan Pembayaran
                            </Button>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

