import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getAllMenuItems() :  Observable<MenuItem[]> {
    return this.http.get<MenuItem[]> (`${this.baseUrl}/menu-items`);
  }

  getPopularDishes(names:string[]): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu-items/popular`, {params: {names}}); 
  } 

  // Delete menu item, only admins can perform this action
  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/menu-items/delete/${id}`);
  }
  // Add menu item 
  addMenuItem(menuItemData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/menu-items/add`, menuItemData);
  }

  //Update menu item
  updateMenuItem(menuItem: MenuItem): Observable<any> {
    return this.http.put(`${this.baseUrl}/menu-items/edit`, menuItem);
  }
     
}
