import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {

  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  paginatedRestaurants: any[] = [];
  searchName: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  constructor(private restaurantservice:RestaurantService){

  }

  ngOnInit(): void {
    this.restaurantservice.getRestaurants().subscribe((data =>{
      this.restaurants = data;
      this.filteredRestaurants = data;
      this.updatePagination();

      console.log(this.restaurants);
    }))
  }

  deleteRestaurant(id: number): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantservice.deleteRestaurant(id).subscribe(() => {
        this.restaurants = this.restaurants.filter(restaurant => restaurant.id !== id);
        this.filterRestaurants();
      }, error => console.error(error));
    }
  }

  
  filterRestaurants(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesName = restaurant.name.toLowerCase().includes(this.searchName.toLowerCase());
      return matchesName;
    });
    this.updatePagination();

  }
  

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRestaurants.length / this.itemsPerPage);
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRestaurants = this.filteredRestaurants.slice(startIndex, endIndex);
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }
  
}
