import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  cartCount: number = 0;
  private subscriptions: Subscription[] = [];
  isAdmin: boolean | undefined = false; 

  constructor(private authService:AuthService, private router:Router, private cartService: CartService ){}


  ngOnInit(): void {

    //verify if user is logged in and if user is Admin
    const isAdminSub = this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
    const isLoggedSub = this.authService.isLogged.subscribe(isLogged => this.isLoggedIn = isLogged);

    this.subscriptions.push(isAdminSub);
    this.subscriptions.push(isLoggedSub);

    //get the total items in the cart
    const cartSub = this.cartService.cartSubject.subscribe(cart => {
      this.cartCount = cart.cartCount;
    })
    this.subscriptions.push(cartSub);
  }

  // logout, reset cart and redirect to login
  logout() {
    this.authService.logout();
    this.cartService.resetCart();
    this.router.navigate(['/login']);
  }

  //Unsubscribe from all subscriptions to avoid memory leaks
  ngOnDestroy():void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
