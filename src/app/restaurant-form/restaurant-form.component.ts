import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'models/menu.model';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {

  restaurantForm: FormGroup;
  restaurantId: string | null;
  menuItems: MenuItem[] = [];



  constructor(private restuarantservice: RestaurantService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      contact: ['', [this.mobileNumberValidator, Validators.required, this.numericValidator]],




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

  mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
    const valid = /^\d{10}$/.test(control.value);
    return valid ? null : { invalidMobileNumber: true };
  }
}


