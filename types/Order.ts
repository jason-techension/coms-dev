import { Distributor } from "./Distributor";
import { Hospital } from "./Hospital";
import { Item } from "./Item";

export type Order = {
    id: string;
    hospital: Hospital;
    distributor: Distributor;
    products: OrderItems[];
    date: string;
    status: string;
    total: number;
}

export type OrderItems = {
    id: string;
    product: Item;
    quantity: number;
    total: number;
}