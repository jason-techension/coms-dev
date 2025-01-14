import { Distributor } from "@/types/Distributor"
import { Hospital } from "@/types/Hospital"
import { Item } from "@/types/Item"
import { Order, OrderItems } from "@/types/Order"

export const ITEMS: Item[] = [
    {
        id: "1",
        name: 'KSO Penguji Covid-19',
        stock: 10,
        price: 50000000,
    },
    {
        id: "2",
        name: 'YVJ-TE4',
        stock: 8,
        price: 2000000,
    },
    {
        id: "3",
        name: 'ZP02201-192',
        stock: 22,
        price: 2500000,
    },
    {
        id: "4",
        name: 'CT8223-48T',
        stock: 25,
        price: 1000000,
    },
    {
        id: "5",
        name: 'Sorenson 36060P',
        stock: 20,
        price: 2200000,
    },
    {
        id: "6",
        name: 'Sorenson 14200P',
        stock: 17,
        price: 1200000,
    },
    {
        id: "7",
        name: 'Sorenson 11510P',
        stock: 19,
        price: 2500000,
    },
    {
        id: "8",
        name: 'PCR-0104',
        stock: 18,
        price: 2700000,
    },
    {
        id: "9",
        name: 'DITF-002',
        stock: 15,
        price: 1200000,
    },
]

const ORDER_1: OrderItems[] = [
    {
        id: "1",
        product: ITEMS[0],
        quantity: 1,
        total: ITEMS[0].price*1
    },
    {
        id: "2",
        product: ITEMS[1],
        quantity: 5,
        total: ITEMS[1].price*5
    },
    {
        id: "3",
        product: ITEMS[2],
        quantity: 2,
        total: ITEMS[2].price*2
    },
]

export const ORDERS: Order[] = [
    {
        id: "1",
        hospital: {
            id: "1",
            name: 'Hospital 1',
            email: 'hospital@mail.com',
        },
        distributor: {
            id: "1",
            name: 'Distributor 1',
            email: 'distributor@mail.com',
        },
        products: ORDER_1,
        date: '2021-08-01',
        status: "Pending",
        total: ORDER_1.reduce((acc, item) => acc + item.total, 0)
    }
]

export const DISTRIBUTORS: Distributor[] = [
    {
        id: "1",
        name: 'Distributor 1',
        email: 'distributor@mail.com',
        orders: ORDERS
    }
]

export const HOSPITALS: Hospital[] = [
    {
        id: "1",
        name: 'Hospital 1',
        email: 'hospital@mail.com',
        orders: ORDERS
    }
]

export const DUMMY_TRANSPORTATIONS = [
    {
        sender: {
            name: 'Driver 1',
            email: 'distributor@mail.com',
        },
        vehicle: 'Truk',
        date: '2021-08-01',
        location: 'Surabaya',
    },
    {
        sender: {
            name: 'Driver 2',
            email: 'distributor@mail.com',
        },
        vehicle: 'Truk',
        date: '2021-08-02',
        location: 'Jakarta',
    },
    {
        sender: {
            name: 'Driver 3',
            email: 'distributor@mail.com',
        },
        vehicle: 'Truk',
        date: '2021-08-03',
        location: 'Banten',
    }
]