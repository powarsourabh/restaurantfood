import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'models/category.model';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit{

  menuForm: FormGroup;
  menuItemId: string | null;
  categories: Category[] = [];
  restaurants: any[] = [];

  

  constructor(private fb: FormBuilder,
     private restaurantservice: RestaurantService,
    private router: Router,
  private route: ActivatedRoute ){
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      restaurantId: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
    this.menuItemId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.restaurantservice.getCategories().subscribe((data) => {
      this.categories = data;
      this.restaurantservice.getRestaurants().subscribe((data)=> {
        this.restaurants = data;
      })
    });

    if (this.menuItemId) {
      this.restaurantservice.getMenuItems('').subscribe((data) => {
        const menuItem = data.find(menuItem => menuItem.id === this.menuItemId);
        if (menuItem) {
          this.menuForm.patchValue({
          
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            restaurantId:menuItem.restaurantId,
            categoryId: menuItem.categoryId
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      const menuItemData = this.menuForm.value;
      if (this.menuItemId) {
        this.restaurantservice.updateMenuItem(this.menuItemId, menuItemData).subscribe(() => {
          this.router.navigate(['/menus']);
        });
      } else {
        this.restaurantservice.addMenuItem(menuItemData).subscribe(() => {
          this.router.navigate(['/menus']);
        });
      }
    }
  }

}
