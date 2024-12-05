import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
   private initialCart: Cart = {cartItems:[], cartTotal:0, cartCount:0};
   cartSubject = new BehaviorSubject<Cart>(this.initialCart);

  constructor() {
    this.getCart(); //initialize cart
  }

  //load cart from local Storage
  private getCart() {
    const cart = localStorage.getItem('cart');
    if(cart) {
      this.cartSubject.next(JSON.parse(cart));
    }
  }

  // add item to cart
  addItemToCart(cartItem : CartItem) {
    const existingItem = this.cartSubject.value.cartItems.find((item: CartItem) => item.menuItem.id === cartItem.menuItem.id);

    if(existingItem) {
      existingItem.quantity +=1;
      this.cartItemTotal(existingItem);
    } else {
      this.cartItemTotal(cartItem);
      this.cartSubject.value.cartItems.push(cartItem);
    }

    this.updateCart();
    console.log(this.cartSubject.value);
  }

  //increase item quantity in the cart
  increaseQuantity(menuItem_id:number) {
    const existingItem = this.cartSubject.value.cartItems.find((item: CartItem) => item.menuItem.id === menuItem_id);

    if(existingItem) {
      existingItem.quantity +=1;
      this.cartItemTotal(existingItem);
      this.updateCart();
    }
  }

  //decrease item quantity in the cart and remove if quantity reaches 0
  decreaseQuantity(menuItem_id:number) {
      const existingItem = this.cartSubject.value.cartItems.find((item: CartItem) => item.menuItem.id === menuItem_id);
  
      if(existingItem && existingItem.quantity > 1) {
        existingItem.quantity -=1;
        this.cartItemTotal(existingItem);
        this.updateCart();
      } else {
        this.removeItem(menuItem_id);
      }

      
  }

  //remove item from cart
  removeItem(menuItem_id:number) {
    let cart = this.cartSubject.value;
    cart.cartItems = cart.cartItems.filter(cartItem => cartItem.menuItem.id !== menuItem_id);
    this.cartSubject.next(cart);
    this.updateCart();
  }

  // update and save cart to local storage
 private updateCart() {
  const cart = this.cartSubject.value;
  // calculate cart count
  cart.cartCount = cart.cartItems.reduce((count: number, cartItem: CartItem) => count + cartItem.quantity, 0);
  // calculate cart total
    cart.cartTotal = cart.cartItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  // update cartSubject  
    this.cartSubject.next(cart);
  // save the cart to local storage
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  //calculate cart item total amount
  private cartItemTotal(cartItem: CartItem) {
    cartItem.cartItemTotal = cartItem.menuItem.price * cartItem.quantity;
  }

  //reset cart
  resetCart() {
    this.cartSubject.next({cartItems:[], cartTotal:0, cartCount:0});
    localStorage.removeItem('cart');
  }


}

