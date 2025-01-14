import { CartDropdown } from "../components/common/CartDropdown"
import NotificationBell from "../components/common/Notification"
import PaymentModal from "../components/common/PaymentModal"
import { Sidebar } from "../components/common/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-end p-4 gap-x-2">
          <NotificationBell />
          <CartDropdown />
          <PaymentModal />
        </header>
        {children}
      </main>
    </div>
  )
}

