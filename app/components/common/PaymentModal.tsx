"use client";

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCartStore } from '@/store/cart.store';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DISTRIBUTORS, HOSPITALS } from '@/constants/dummy';
import { Order } from '@/types/Order';
import { useOrderStore } from '@/store/orders.store';
import { useNotificationStore } from '@/store/notifications.store';
import { useRouter } from 'next/navigation';

function PaymentModal() {
    const router = useRouter();
    const { addNewOrder } = useOrderStore();
    const { addNotification } = useNotificationStore();
    const { showPaymentModal, setShowPaymentModal, paymentStatus, setPaymentStatus, selectedItems, total, resetCart} = useCartStore();

    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})

    const addOrderToStore = () => {
        const hospital = HOSPITALS[0];
        const distributor = DISTRIBUTORS[0];

        const newOrder: Order = {
            id: crypto.randomUUID(),
            hospital,
            distributor,
            products: selectedItems,
            total: total,
            status: 'Pending',
            date: new Date().toISOString()
        }

        addNewOrder(newOrder);
    }

    const handleProcessPayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method')
            return
        }

        setIsSubmitting(true)
        setPaymentStatus('processing')
        addOrderToStore();
        addNotification({
            message: 'Order baru diterima!',
            timestamp: new Date(),
            type: 'order'
        })

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            setPaymentStatus('success')
        } catch (error) {
            console.log('error', error)
            setPaymentStatus('error')
        } finally {
            setIsSubmitting(false)
            router.push('/hospital')
        }
    }

    const handleClosePayment = () => {
        if (paymentStatus === 'success') {
            // Reset the form
            resetCart();
            setSelectedQuantities({})
        }
        setShowPaymentModal(false)
        setPaymentStatus('pending')
        setPaymentMethod('')
    }

    return (
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {paymentStatus === 'success' ? 'Pembayaran Berhasil' : 'Lakukan Pembayaran'}
                    </DialogTitle>
                    <DialogDescription>
                        {paymentStatus === 'success'
                            ? 'Pesanan kamu akan diproses segera'
                            : 'Silahkan pilih metode pembayaran yang diinginkan'}
                    </DialogDescription>
                </DialogHeader>

                {paymentStatus === 'pending' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">Pesanan</h3>
                            <p className="text-sm text-gray-500">
                                Jumlah produk: {selectedItems.length}
                            </p>
                            <p className="text-lg font-semibold">
                                Nominal Pembayaran: Rp {total.toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Pilih Metode Pembayaran
                            </label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                                    <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                                    <SelectItem value="virtual_account">Virtual Account</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {paymentStatus === 'processing' && (
                    <div className="py-8 flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p>Memproses pembayaran...</p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="py-8 flex flex-col items-center space-y-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <div className="text-center">
                            <p className="font-medium">Pembayaran Diterima!</p>
                            <p className="text-sm text-gray-500">
                                Pesanan kamu akan diproses segera
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {paymentStatus === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setShowPaymentModal(false)}
                            >
                                Kembali
                            </Button>
                            <Button
                                onClick={handleProcessPayment}
                                disabled={!paymentMethod || isSubmitting}
                            >
                                {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
                            </Button>
                        </>
                    )}
                    {paymentStatus === 'success' && (
                        <Button onClick={handleClosePayment}>
                            Kembali
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentModal