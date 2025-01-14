'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Search, Plus, Loader2, CheckCircle2 } from "lucide-react"
import { Order, OrderItems } from "@/types/Order"
import { Item } from "@/types/Item"
import { DISTRIBUTORS, HOSPITALS, ITEMS } from "@/constants/dummy"
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
import { useOrderStore } from "@/store/orders.store"
import { useRouter } from "next/navigation"
import { useNotificationStore } from "@/store/notifications.store"

const ITEMS_PER_PAGE = 5;

export default function OrderForm() {
    const router = useRouter();
    const { addNewOrder } = useOrderStore();
    const { addNotification } = useNotificationStore();

    const [selectedItems, setSelectedItems] = useState<OrderItems[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
    const [paymentMethod, setPaymentMethod] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filter and paginate items
    const filteredItems = ITEMS.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleAddItem = (item: Item) => {
        const quantity = selectedQuantities[item.id] || 1
        if (quantity > item.stock) {
            alert("Quantity cannot exceed available stock!")
            return
        }

        const existingItem = selectedItems.find(
            selected => selected.product.id === item.id
        )

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity
            if (newQuantity > item.stock) {
                alert("Total quantity cannot exceed available stock!")
                return
            }

            setSelectedItems(prev =>
                prev.map(selected =>
                    selected.product.id === item.id
                        ? {
                            ...selected,
                            quantity: newQuantity,
                            total: item.price * newQuantity,
                        }
                        : selected
                )
            )
        } else {
            setSelectedItems(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    product: item,
                    quantity: quantity,
                    total: item.price * quantity,
                },
            ])
        }

        // Reset quantity for this item
        setSelectedQuantities(prev => ({ ...prev, [item.id]: 1 }))
    }

    const handleRemoveItem = (itemId: string) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId))
    }

    const handleQuantityChange = (itemId: string, value: string) => {
        const num = parseInt(value)
        if (isNaN(num) || num < 1) return
        setSelectedQuantities(prev => ({ ...prev, [itemId]: num }))
    }

    const handleSubmitOrder = () => {
        setIsPaymentModalOpen(true)
        setPaymentStatus('pending')
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
            setSelectedItems([])
            setSelectedQuantities({})
        }
        setIsPaymentModalOpen(false)
        setPaymentStatus('pending')
        setPaymentMethod('')
    }

    const addOrderToStore = () => {
        const hospital = HOSPITALS[0];
        const distributor = DISTRIBUTORS[0];

        // const orderItems = selectedItems.map(item => {
        //     return {
        //         product: item.product,
        //         quantity: item.quantity
        //     }
        // })

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

    const total = selectedItems.reduce((sum, item) => sum + item.total, 0)

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Buat Order Baru</CardTitle>
                    <CardDescription>Pilih produk yang ingin dipesan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Available Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="max-w-sm"
                            />
                        </div>

                        <Table>
                            <TableCaption>Pilihan Produk</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Stok</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.stock}</TableCell>
                                        <TableCell>
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="w-32">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.stock}
                                                value={selectedQuantities[item.id] || 1}
                                                onChange={e => handleQuantityChange(item.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddItem(item)}
                                                disabled={item.stock === 0}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambah
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                    {/* Selected Items Section */}
                    <div className="mt-8">
                        <Table>
                            <TableCaption>Keranjang Belanja</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Harga Satuan</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            Rp {item.product.price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            Rp {item.total.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {selectedItems.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                            Total Akhir
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            Rp {total.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        size="lg"
                        disabled={selectedItems.length === 0}
                        // onClick={() => {
                        //     // Handle order submission here
                        //     console.log('Order submitted:', {
                        //         items: selectedItems,
                        //         total
                        //     })
                        // }}
                        onClick={handleSubmitOrder}
                    >
                        Buat Pesanan
                    </Button>
                </CardFooter>

                {/* Payment Modal */}
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
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
                                        onClick={() => setIsPaymentModalOpen(false)}
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
            </Card>
        </div>
    )
}