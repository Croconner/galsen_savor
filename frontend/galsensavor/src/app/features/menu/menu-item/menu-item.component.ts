import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuItem } from '../../../core/models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';


@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDialogModule, CurrencyPipe, CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { menuItem: MenuItem, isLoggedIn: boolean }, private cartService: CartService) {}

  addToCart(menuItem: MenuItem) {
   this.cartService.addItemToCart({menuItem:menuItem, quantity:1})
  }
}

