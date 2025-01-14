'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, ListPlus } from 'lucide-react'
import { DISTRIBUTORS, HOSPITALS } from '@/constants/dummy'

const HOSPITAL_NAV_ITEMS = [
    {
        icon: LayoutDashboard,
        label: 'Dasbor',
        href: '/hospital'
    },
    {
        icon: ListPlus,
        label: 'Buat Order',
        href: '/hospital/order'
    },
]

const DISTRIBUTOR_NAV_ITEMS = [
    {
        icon: LayoutDashboard,
        label: 'Dasbor',
        href: '/distributor'
    },
    // {
    //     icon: Truck,
    //     label: 'Track Deliveries',
    //     href: '/distributor/tracking'
    // },
    // {
    //     icon: ListPlus,
    //     label: 'Buat Order',
    //     href: '/distributor/order'
    // },
]

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <h1 className="text-xl font-bold">COMS<sub>dev</sub></h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-2">
                    {pathname.startsWith('/hospital') ? HOSPITAL_NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${pathname === item.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <item.icon className="mr-3 h-6 w-6" />
                            {item.label}
                        </Link>
                    )) : DISTRIBUTOR_NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${pathname === item.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <item.icon className="mr-3 h-6 w-6" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col p-4 border-t border-gray-700">
                <div className="text-sm">
                    {
                        pathname.startsWith('/hospital') ? <>
                            <p className="font-medium">{HOSPITALS[0].name}</p>
                            <p className="text-gray-400">{HOSPITALS[0].email}</p>
                        </> : <>
                            <p className="font-medium">{DISTRIBUTORS[0].name}</p>
                            <p className="text-gray-400">{DISTRIBUTORS[0].email}</p>
                        </>
                    }
                </div>
                <Link href="/" className="mt-4 flex items-center text-sm text-gray-400 hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                </Link>
            </div>
        </div>
    )
}

