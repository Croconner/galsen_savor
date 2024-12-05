import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../core/models/menu-item.model';
import { MenuService } from '../../core/services/menu.service';
import { NgFor, NgIf } from '@angular/common';
import { CONSTANTS } from '../../shared/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, RouterLink, MatButtonModule, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  popularDishes : MenuItem[] = [];
  testimonials = CONSTANTS.customerTestimonials;
  about = CONSTANTS.about;

  constructor(private menuService: MenuService){}


  ngOnInit(): void {

    this.menuService.getPopularDishes(['Thieboudienne', 'Yassa Poulet']).subscribe(
      response => {
        this.popularDishes = response;
      }
    );
  }

}
