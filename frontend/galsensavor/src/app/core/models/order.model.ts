import { MenuItem } from "./menu-item.model";
import { User } from "./user.model";

export interface Order {
    id: number;
    orderDate?: Date;
    orderLineItems: OrderLineItem[];
    user: User | null;
    totalAmount: number;
}

export interface OrderLineItem {
    id: number;
    menuItem: MenuItem;
    quantity: number;
    lineItemTotal?: number;
}