import { Order } from "./Order";

export type Hospital = {
    id: string;
    name: string;
    email: string;

    orders?: Order[];
}