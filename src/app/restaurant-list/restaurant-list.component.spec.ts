import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantListComponent } from './restaurant-list.component';
import { RestaurantService } from '../restaurant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RestaurantListComponent', () => {
  let component: RestaurantListComponent;
  let fixture: ComponentFixture<RestaurantListComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;

  const mockRestaurants = [
    { id: 1, name: 'Restaurant 1', description: 'Description 1', location: 'Location 1', contact: 'Contact 1' },
    { id: 2, name: 'Restaurant 2', description: 'Description 2', location: 'Location 2', contact: 'Contact 2' },
    { id: 3, name: 'Restaurant 3', description: 'Description 3', location: 'Location 3', contact: 'Contact 3' }
  ];

  beforeEach(async () => {
    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getRestaurants', 'deleteRestaurant']);

    await TestBed.configureTestingModule({
      declarations: [RestaurantListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantListComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    restaurantService.getRestaurants.and.returnValue(of(mockRestaurants));
    restaurantService.deleteRestaurant.and.returnValue(of(void 0));  // Ensure it returns Observable<void>
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize restaurants on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.restaurants).toEqual(mockRestaurants);
    expect(component.filteredRestaurants).toEqual(mockRestaurants);
    expect(component.paginatedRestaurants.length).toBe(3);
  });

  it('should filter restaurants by name', () => {
    fixture.detectChanges();
    component.searchName = 'Restaurant 1';
    component.filterRestaurants();
    expect(component.filteredRestaurants.length).toBe(1);
    expect(component.filteredRestaurants[0].name).toBe('Restaurant 1');
  });

  it('should update pagination', () => {
    fixture.detectChanges();
    component.itemsPerPage = 2;
    component.updatePagination();
    expect(component.totalPages).toBe(2);
    expect(component.paginatedRestaurants.length).toBe(2);
  });

  it('should paginate to next page', () => {
    fixture.detectChanges();
    component.itemsPerPage = 2;
    component.updatePagination();
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.paginatedRestaurants.length).toBe(1);
  });

  it('should paginate to previous page', () => {
    fixture.detectChanges();
    component.itemsPerPage = 2;
    component.updatePagination();
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
    expect(component.paginatedRestaurants.length).toBe(2);
  });

  it('should delete a restaurant', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    component.deleteRestaurant(1);
    expect(component.restaurants.length).toBe(2);
    expect(component.restaurants.find(r => r.id === 1)).toBeUndefined();
  });

  it('should not delete a restaurant if confirm is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();
    component.deleteRestaurant(1);
    expect(component.restaurants.length).toBe(3);
  });

  it('should call deleteRestaurant when delete button is clicked', () => {
    spyOn(component, 'deleteRestaurant');
    fixture.detectChanges();
    const deleteButtons = fixture.debugElement.queryAll(By.css('.btn-danger'));
    deleteButtons[0].triggerEventHandler('click', null);
    expect(component.deleteRestaurant).toHaveBeenCalledWith(1);
  });
});
