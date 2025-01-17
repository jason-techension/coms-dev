'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useOrderStore } from "@/store/orders.store"
import { useState } from "react"
import { Order } from "@/types/Order"
import { DUMMY_TRANSPORTATIONS } from "@/constants/dummy"

export default function HospitalDashboard() {
    const { orders } = useOrderStore();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeliveryOpen, setIsModalDeliveryOpen] = useState(false);

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // const handleDeliveryClick = (order: Order) => {
    //     setSelectedOrder(order);
    //     setIsModalDeliveryOpen(true);
    // }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Seluruh Order yang sedang atau pernah dilakukan</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Reference ID</TableHead>
                                <TableHead>Jumlah Barang</TableHead>
                                <TableHead>Tanggal Dibuat</TableHead>
                                <TableHead>Total Pembayaran</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, idx) => (
                                <TableRow key={order.id}>
                                    <TableCell className="truncate">{order.id}</TableCell>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleOrderClick(order)}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                        >
                                            {order.products.length} produk
                                        </button>
                                    </TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>Rp {order.total?.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        {/* {order.status === 'In Delivery' ?
                                            <button
                                                onClick={() => handleDeliveryClick(order)}
                                                className="text-blue-600 hover:underline cursor-pointer"
                                            >
                                                {order.status}
                                            </button> :
                                            <p></p>
                                        } */}
                                        {order.status}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Pesanan #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead className="text-right">Harga Satuan</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedOrder?.products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.product.name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            Rp {product.product.price?.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Rp {(product.product.price * product.quantity)?.toLocaleString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        Rp {selectedOrder?.total?.toLocaleString('id-ID')}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delivery Tracking */}
            <Dialog open={isModalDeliveryOpen} onOpenChange={setIsModalDeliveryOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Pengiriman #{selectedOrder?.id}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Pengirim</TableHead>
                                    <TableHead>Kendaraan</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DUMMY_TRANSPORTATIONS?.map((progress, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{progress.sender.name}</TableCell>
                                        <TableCell>{progress.vehicle}</TableCell>
                                        <TableCell>{progress.date}</TableCell>
                                        <TableCell>{progress.location}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}