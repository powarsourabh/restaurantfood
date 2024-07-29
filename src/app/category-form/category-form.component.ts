import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  categoryForm: FormGroup;
  categoryId: string | null;

  constructor(private fb: FormBuilder,
     private restaurantservice: RestaurantService,
      private route: ActivatedRoute,
    private router: Router ){

      this.categoryForm = this.fb.group({
        name: ['', Validators.required]
      });
      this.categoryId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.categoryId) {
      this.restaurantservice.getCategories().subscribe((data) => {
        const category = data.find(category => category.id === this.categoryId);
        if (category) {
          this.categoryForm.patchValue({
            name: category.name
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      if (this.categoryId) {
        this.restaurantservice.updateCategory(this.categoryId, categoryData).subscribe(() => {
          this.router.navigate(['/categories']);
        });
      } else {
        this.restaurantservice.addCategory(categoryData).subscribe(() => {
          this.router.navigate(['/categories']);
        });
      }
    }
  }
}
