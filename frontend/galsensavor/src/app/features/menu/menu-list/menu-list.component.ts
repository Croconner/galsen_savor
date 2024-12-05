import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../../core/models/menu-item.model';
import { MenuService } from '../../../core/services/menu.service';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CONSTANTS } from '../../../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [MatCardModule,MatButtonModule, CurrencyPipe, MatIconModule, MatTabsModule, RouterLink],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit{

  allMenuItems: MenuItem[] = [];
  filterMenuItems: MenuItem[] = [];
  menuIntro = CONSTANTS.menuIntro;
  categories = CONSTANTS.categories;
  isLoggedIn = false;
  firstName: string | undefined = '';


  constructor(private menuService: MenuService, private dialog: MatDialog, private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.user.subscribe(user=>{
      this.isLoggedIn = user? true : false;
      this.firstName = user?.firstName;
    })
    this.menuService.getAllMenuItems().subscribe(items => {
      this.allMenuItems = items;
    });
  }

  menuByCategory(category:string) : MenuItem[] {
    if (category == 'All') {
      return this.allMenuItems;
    } else {
      return this.allMenuItems.filter(menuItem => menuItem.category == category);
    }
  }

  selectedMenuItem(menuItem: MenuItem): void {
    this.dialog.open(MenuItemComponent, {
      data: {menuItem: menuItem, isLoggedIn: this.isLoggedIn},
      height: '500px',
    })
  }
}
