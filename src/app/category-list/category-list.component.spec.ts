import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { RestaurantService } from '../restaurant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Category } from 'models/category.model';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;

  const mockCategories: Category[] = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' },
    { id: '3', name: 'Category 3' }
  ];

  beforeEach(async () => {
    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getCategories', 'deleteCategory']);

    await TestBed.configureTestingModule({
      declarations: [CategoryListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    // Mock the getCategories method
    restaurantService.getCategories.and.returnValue(of(mockCategories));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize categories on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.categories).toEqual(mockCategories);
    expect(component.filtercategories).toEqual(mockCategories);
    expect(component.totalPages).toBe(1);
  });

  

  it('should update pagination correctly', () => {
    component.updatePagination();
    expect(component.totalPages).toBe(0);
    expect(component.paginatedRestaurants.length).toBe(0);
  });
});
