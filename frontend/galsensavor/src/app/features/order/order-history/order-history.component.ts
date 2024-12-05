import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Order } from '../../../core/models/order.model'; 
import { OrderService } from '../../../core/services/order.service'; 
import { AuthService } from '../../../core/services/auth.service'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgFor, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'] 
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = []; 
  userId: number = 0;
  emptyOrders: boolean = false;
  userSub: Subscription = new Subscription();

  constructor(private orderService: OrderService, private authService: AuthService, private cartService: CartService) {} 

  ngOnInit(): void {
      this.userSub = this.authService.user.subscribe(user => {
      this.userId = user?.id || 0;
    })
    this.orderService.getOrderById(this.userId).subscribe(orders => {
      this.orders = orders;
      this.emptyOrders = this.orders.length === 0;
    });
  }

  reOrder(order: Order) {
    const validOrderLineItems = order.orderLineItems.filter(
      item => item.menuItem && item.quantity
    );
    const mappedItems = validOrderLineItems.map(item => ({
      menuItem: item.menuItem,
      quantity: item.quantity,
    }));
    mappedItems.forEach(item => this.cartService.addItemToCart(item));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
