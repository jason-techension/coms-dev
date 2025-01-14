import TrackDeliveries from '@/app/components/pages/TrackDeliveries'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery Tracking',
  description: 'Track your order delivery status',
}

export default function DeliveryTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Delivery Tracking</h1>
      <TrackDeliveries orderId={params.id} />
    </div>
  )
}

