import { Component, OnInit } from '@angular/core';
import { Category } from 'models/category.model';
import { MenuItem } from 'models/menu.model';
import { RestaurantService } from '../restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  menuItems: MenuItem[] = [];
  categories: Category[] = [];
  restaurants: any[] = [];


  constructor(private restaurantservice: RestaurantService){

  }
  ngOnInit(): void {
    this.restaurantservice.getMenuItems('').subscribe((data) => {
      this.menuItems = data;
    });

    this.restaurantservice.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.restaurantservice.getRestaurant('').subscribe((data) => {
      this.restaurants = data;
    })
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(category => category.id === categoryId);
    return category ? category.name : '';
  }

getRestaurantname(restaurantId: string): string{
  const restaurant = this.restaurants.find(restaurant => restaurant.id === restaurantId);
  return restaurant ? restaurant.name : '';
}

  onDelete(id: string): void {
    this.restaurantservice.deleteMenuItem(id).subscribe(() => {
      this.menuItems = this.menuItems.filter(menuItem => menuItem.id !== id);
    });
  }
}
