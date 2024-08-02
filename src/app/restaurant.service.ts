import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from 'models/category.model';
import { MenuItem } from 'models/menu.model';


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  

  private apiurl = "http://localhost:3000/restaurants";

  private apiUrl1 = 'http://localhost:3000/categories';
  private apiUrl2 = 'http://localhost:3000/menus';



  constructor(private http: HttpClient) { }


  getRestaurants(): Observable<any> {
    return this.http.get(this.apiurl);
  }

  getRestaurant(id: string): Observable<any> {
    return this.http.get(`${this.apiurl}/${id}`);
  }

  addRestaurant(restaurant: any): Observable<any> {
    return this.http.post(this.apiurl, restaurant);
  }

  updateRestaurant(id: string, restaurant: any): Observable<any> {
    return this.http.put(`${this.apiurl}/${id}`, restaurant);
  }

 

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiurl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl1);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl1, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl1}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl1}/${id}`);
  }

  getMenuItems(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl2}?restaurantId=${restaurantId}`);
  }

  addMenuItem(menuItem: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl2, menuItem);
  }

  updateMenuItem(id: string, menuItem: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl2}/${id}`, menuItem);
  }
  
  deleteMenuItem(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl2}/${id}`);

  }

}
