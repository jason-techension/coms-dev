'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
import { Search, Plus } from "lucide-react"
import { Item } from "@/types/Item"
import { ITEMS } from "@/constants/dummy"
import { useCartStore } from "@/store/cart.store"

const ITEMS_PER_PAGE = 5;

export default function OrderForm() {
    const { addItem, selectedItems } = useCartStore();

    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})

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

            addItem({
                id: crypto.randomUUID(),
                product: item,
                quantity: newQuantity,
                total: item.price * newQuantity,
            })
        } else {
            addItem({
                id: crypto.randomUUID(),
                product: item,
                quantity: quantity,
                total: item.price * quantity,
            })
        }

        // Reset quantity for this item
        setSelectedQuantities(prev => ({ ...prev, [item.id]: 1 }))
    }

    const handleQuantityChange = (itemId: string, value: string) => {
        const num = parseInt(value)
        if (isNaN(num) || num < 1) return
        setSelectedQuantities(prev => ({ ...prev, [itemId]: num }))
    }

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
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10"
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
                </CardContent>

                {/* Payment Modal */}
                {/* <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
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
                </Dialog> */}
            </Card>
        </div>
    )
}