import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RestaurantFormComponent } from './restaurant-form.component';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute, Routes } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RestaurantFormComponent', () => {
  let component: RestaurantFormComponent;
  let fixture: ComponentFixture<RestaurantFormComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;
  const routes: Routes = [
    { path: 'restaurants', component: RestaurantFormComponent }
  ];
  beforeEach(async () => {
    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getRestaurant', 'addRestaurant', 'updateRestaurant']);

    await TestBed.configureTestingModule({
      declarations: [ RestaurantFormComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantFormComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    // Mock getRestaurant method
    restaurantService.getRestaurant.and.returnValue(of({
      id: '1',
      name: 'Test Restaurant',
      description: 'Test Description',
      location: 'Test Location',
      contact: '1234567890',
      // imageUrl: 'test-url'
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with restaurant data if restaurantId is provided', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.restaurantForm.value).toEqual({
      name: 'Test Restaurant',
      description: 'Test Description',
      location: 'Test Location',
      contact: '1234567890',
      // imageUrl: 'test-url'
    });
  });

  it('should validate the mobile number correctly', () => {
    const contact = component.restaurantForm.controls['contact'];

    contact.setValue('1234567890');
    expect(contact.valid).toBeTruthy();

    contact.setValue('12345');
    expect(contact.valid).toBeFalsy();
    expect(contact.errors).toEqual({ invalidMobileNumber: true });
  });

  it('should add a new restaurant on submit', () => {
    component.restaurantId = null;
    const addRestaurantSpy = restaurantService.addRestaurant.and.returnValue(of({}));
    component.restaurantForm.setValue({
      name: 'New Restaurant',
      description: 'New Description',
      location: 'New Location',
      contact: '0987654321'
    });

    component.onSubmit();

    expect(addRestaurantSpy).toHaveBeenCalledWith({
      name: 'New Restaurant',
      description: 'New Description',
      location: 'New Location',
      contact: '0987654321'
    });
  });

  it('should update an existing restaurant on submit', () => {
    component.restaurantId = '1';
    const updateRestaurantSpy = restaurantService.updateRestaurant.and.returnValue(of({}));
    component.restaurantForm.setValue({
      name: 'Updated Restaurant',
      description: 'Updated Description',
      location: 'Updated Location',
      contact: '0987654321'
    });

    component.onSubmit();

    expect(updateRestaurantSpy).toHaveBeenCalledWith('1', {
      name: 'Updated Restaurant',
      description: 'Updated Description',
      location: 'Updated Location',
      contact: '0987654321'
    });
  });

  it('should display error message if mobile number is invalid', () => {


    const contact = component.restaurantForm.controls['contact'];

    contact.setValue('123');
    expect(contact.invalid).toBeTruthy();

  });
  
});
