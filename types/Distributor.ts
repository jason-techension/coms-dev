import { Order } from "./Order";

export type Distributor = {
    id: string;
    name: string;
    email: string;
    
    orders?: Order[];
}