import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {

  restaurantForm: FormGroup;
  restaurantId: string | null;


  constructor(private restuarantservice: RestaurantService, 
    private fb: FormBuilder,
     private router: Router,
      private route: ActivatedRoute){
        this.restaurantForm = this.fb.group({
          name: ['', Validators.required], 
          description: ['', Validators.required], 
          location: ['', Validators.required],
          contact: ['', [Validators.required, this.numericValidator]],

          // imageUrl: ['', Validators.required]

          // imageFile: [null, Validators.required] 

        });
        this.restaurantId = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    if (this.restaurantId) {
      this.restuarantservice.getRestaurant(this.restaurantId).subscribe((data) => {
        this.restaurantForm.setValue({
          name: data.name,
          description: data.description,
          location: data.location,
          contact: data.contact,
          imageUrl: data.imageUrl
        });
      });
    }
  }



  onSubmit(): void {
    if (this.restaurantForm.valid) {
      if (this.restaurantId) {
        this.restuarantservice.updateRestaurant(this.restaurantId, this.restaurantForm.value).subscribe(() => {
          this.router.navigate(['/restaurants']);
        });
      } else {
        this.restuarantservice.addRestaurant(this.restaurantForm.value).subscribe(() => {
          this.router.navigate(['/restaurants']);
        });
      }
    }
  }


 



  numericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && isNaN(value)) {
      return { numeric: true };
    }
    return null;
  }
}
