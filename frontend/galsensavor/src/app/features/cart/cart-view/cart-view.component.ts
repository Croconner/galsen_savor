import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../../core/models/cart.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderReceiptComponent } from '../../order/order-receipt/order-receipt.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.scss'
})
export class CartViewComponent implements OnInit, OnDestroy {


  cartItems: CartItem [] = [];
  cartCount = 0;
  cartTotal = 0;
  emptyCart = true;
  cartSub: Subscription = new Subscription();
  user: User | null = null;
  isLoading = false;
  isSubmitting = false;
  userSub: Subscription = new Subscription();
  

constructor(private cartService: CartService,
   private orderService: OrderService,
   private dialog: MatDialog, 
   private authService: AuthService){}


  //subscribe to cart 
  ngOnInit(): void {
    const cartSub = this.cartService.cartSubject.subscribe(cart => {
      this.cartItems = cart.cartItems;
      this.cartCount = cart.cartCount;
      this.cartTotal = cart.cartTotal;
      this.emptyCart = cart.cartItems.length == 0 ? true : false;
    });
    this.cartSub = cartSub;

    //verify if user is logged in
    const userSub = this.authService.user.subscribe(user => {
      this.user = user? user : null;
    })
    this.userSub = userSub;
  }

  //clear cart
  clearCart(){
    this.cartService.resetCart();
  }

  //increase item quantity
  increaseQuantity(menuItem_id: number){
    this.cartService.increaseQuantity(menuItem_id);
  }

   //decrease item quantity
   decreaseQuantity(menuItem_id: number){
    this.cartService.decreaseQuantity(menuItem_id);
  }

  //remove item from cart
  removeItem(menuItem_id:number){
    this.cartService.removeItem(menuItem_id);
  }

  //place order
  placeOrder(){
    //display loading spinner
      this.isLoading = true;

      //disable place order button 
      this.isSubmitting = true;
    
      // create order from cart

      const order = this.orderService.createOrder(0, this.cartItems, this.cartTotal, this.user);
      this.orderService.placeOrder(order).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSubmitting = false;
          this.clearCart();
          this.dialog.open(OrderReceiptComponent, {
            data: response,
            width: '500px'
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.isSubmitting = false;
          console.log(err);
        }
      })
  }


  //unsubscribe from subscription
  ngOnDestroy(): void {
   this.cartSub.unsubscribe();
   this.userSub.unsubscribe();
  }

}
