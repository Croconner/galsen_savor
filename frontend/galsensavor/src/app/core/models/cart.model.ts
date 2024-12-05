import { MenuItem } from "./menu-item.model";


export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    cartItemTotal?: number;
}

export interface Cart {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal:number;
}