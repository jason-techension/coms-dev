'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, CheckCircle, MapPin, Clock, Box, Building } from 'lucide-react'
import { ORDERS } from '@/constants/dummy'
import { OrderItems } from '@/types/Order'

// Types
type Transportation = {
  sender: { name: string }
  vehicle: string
  date: string
  location: string
  status: 'completed' | 'in-progress' | 'upcoming'
  coordinates?: { lat: number; lng: number }
}

type OrderDetails = {
  id: string
  status: string
  estimatedDelivery: string
  origin: string
  destination: string
  items: OrderItems[]
}

// Dummy data
const DUMMY_TRANSPORTATIONS: Transportation[] = [
  { 
    sender: { name: "Budi Dani" }, 
    vehicle: "Kontainer A", 
    date: "2023-06-01", 
    location: "Gudang 3", 
    status: 'completed',
    coordinates: { lat: -6.2088, lng: 106.8456 }
  },
  { 
    sender: { name: "Doni Andi" }, 
    vehicle: "Truk B", 
    date: "2023-06-02", 
    location: "Sorting Center 5", 
    status: 'completed',
    coordinates: { lat: -6.2088, lng: 106.8456 }
  },
  { 
    sender: { name: "Asep Cecep" }, 
    vehicle: "Truk D", 
    date: "2023-06-03", 
    location: "Pickup Center Kota S", 
    status: 'in-progress',
    coordinates: { lat: -6.1751, lng: 106.8650 }
  },
  { 
    sender: { name: "Akbar Maulana" }, 
    vehicle: "Motor A", 
    date: "2023-06-04", 
    location: "Kecamatan A", 
    status: 'upcoming' 
  },
  { 
    sender: { name: "Suhendi" }, 
    vehicle: "Motor A", 
    date: "2023-06-05", 
    location: "Hospital X", 
    status: 'upcoming' 
  },
]

const DUMMY_ORDER: OrderDetails = {
  id: "1",
  status: "In Transit",
  estimatedDelivery: "Juni 5, 2023",
  origin: "Gudang 3, Tambun",
  destination: "Hospital X, Jakarta Selatan",
  items: ORDERS[0].products
}

export default function TrackDeliveries({ orderId }: { orderId: string }) {
  const [transportations, setTransportations] = useState<Transportation[]>([])
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the data here based on the orderId
    setTransportations(DUMMY_TRANSPORTATIONS)
    setOrderDetails(DUMMY_ORDER)
  }, [orderId])

  const currentLocation = transportations.find(t => t.status === 'in-progress')?.coordinates

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column - Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Tracking untuk Order #{orderId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {transportations.map((step, index) => (
              <div key={index} className="mb-8 flex items-center">
                <div className="flex flex-col items-center mr-4">
                  <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {step.status === 'completed' && <CheckCircle className="h-6 w-6 text-white" />}
                    {step.status === 'in-progress' && <Truck className="h-6 w-6 text-white" />}
                    {step.status === 'upcoming' && <Package className="h-6 w-6 text-white" />}
                  </div>
                  {index < transportations.length - 1 && (
                    <div className="h-14 w-0.5 bg-gray-300 my-2"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{step.location}</h3>
                  <p className="text-sm text-gray-600">{step.date}</p>
                  <p className="text-sm">PIC: {step.sender.name}</p>
                  <p className="text-sm">Kendaraan: {step.vehicle}</p>
                  <Badge variant={
                    step.status === 'completed' ? 'default' :
                    step.status === 'in-progress' ? 'default' : 'secondary'
                  }>
                    {step.status === 'completed' ? 'Selesai' :
                     step.status === 'in-progress' ? 'Dalam Perjalanan' : 'Belum Dimulai'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right column - Map and Order Details */}
      <div className="space-y-6">
        {/* Map Card */}
        <Card>
          <CardHeader>
            <CardTitle>Lokasi Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {currentLocation ? (
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15865.164854261155!2d106.83968413322759!3d-6.225281217966108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1736844857554!5m2!1sen!2sid" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Location data unavailable</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rincian Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {orderDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Estimasi tiba:</span>
                    </div>
                    <p className="text-sm text-gray-600">{orderDetails.estimatedDelivery}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Box className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Status:</span>
                    </div>
                    <Badge>{orderDetails.status}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Rute:</span>
                  </div>
                  <p className="text-sm text-gray-600">Dari: {orderDetails.origin}</p>
                  <p className="text-sm text-gray-600">Ke: {orderDetails.destination}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Produk:</h4>
                  <ul className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.product.name}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

