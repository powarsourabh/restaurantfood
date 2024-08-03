import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Category } from 'models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filtercategories: any[] = [];
  paginatedRestaurants: any[] = [];
  searchName: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private restaurantservice: RestaurantService){

  }

  ngOnInit(): void {
    this.restaurantservice.getCategories().subscribe((data) => {
      this.categories = data;
      this.filtercategories = data;
      this.updatePagination();

      console.log(this.categories);
    });
  }

  onDelete(id: string): void {
    this.restaurantservice.deleteCategory(id).subscribe(() => {
     let categories = this.categories.filter(category => category.id !== id);
     this.categories =categories
    });
  }



  updatePagination(): void {
    this.totalPages = Math.ceil(this.filtercategories.length / this.itemsPerPage);
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRestaurants = this.filtercategories.slice(startIndex, endIndex);
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
