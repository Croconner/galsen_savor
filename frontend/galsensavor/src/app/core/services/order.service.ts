
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderLineItem } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  
  private baseUrl: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  // save order method
  placeOrder(orderObj: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/save`, orderObj);
  }

  //get all orders
  getAllOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/all`);
  }

   //delete order
   deleteOrder(id: number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/orders/delete/${id}`);
  }


  //get order by id
  getOrderById(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/user/${id}`);
  }

  //  convert list of cartItem to list of orderLineItem
  convertCartItemsToOrderLineItems(cartItems: CartItem[]): OrderLineItem[] {

    return cartItems.map(item => {
      const orderLineItem = {
        id: 0, 
        menuItem: item.menuItem,
        quantity: item.quantity,
        lineItemTotal: item.cartItemTotal
      };

      return orderLineItem;
    });
  }
 
  //create an order instance based on cart
  createOrder(id: number, cartItems: CartItem[], cartTotal: number, user: User | null) {
    return { id: id,
       orderLineItems: this.convertCartItemsToOrderLineItems(cartItems),
       user: user, 
       totalAmount: cartTotal };
 }

}
