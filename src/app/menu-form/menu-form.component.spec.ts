import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuFormComponent } from './menu-form.component';
import { RestaurantService } from '../restaurant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Category } from 'models/category.model';
import { MenuItem } from 'models/menu.model';
import { By } from '@angular/platform-browser';

describe('MenuFormComponent', () => {
  let component: MenuFormComponent;
  let fixture: ComponentFixture<MenuFormComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;
  let mockActivatedRoute;

  const mockCategories: Category[] = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  const mockRestaurants: any[] = [
    { id: 'r1', name: 'Restaurant 1' },
    { id: 'r2', name: 'Restaurant 2' }
  ];

  const mockMenuItem: MenuItem = {
    id: '1',
    name: 'Menu Item 1',
    description: 'Description 1',
    price: 10,
    categoryId: '1',
    restaurantId: 'r1'
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getMenuItems', 'getCategories', 'getRestaurants', 'addMenuItem', 'updateMenuItem']);

    await TestBed.configureTestingModule({
      declarations: [MenuFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'menus', component: MenuFormComponent } // Add this line
        ]),
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: RestaurantService, useValue: restaurantServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuFormComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    restaurantService.getMenuItems.and.returnValue(of([mockMenuItem]));
    restaurantService.getCategories.and.returnValue(of(mockCategories));
    restaurantService.getRestaurants.and.returnValue(of(mockRestaurants));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize categories, restaurants, and menu item on ngOnInit', () => {
    fixture.detectChanges();

    expect(component.categories).toEqual(mockCategories);
    expect(component.restaurants).toEqual(mockRestaurants);
    expect(component.menuForm.value).toEqual({
      name: mockMenuItem.name,
      description: mockMenuItem.description,
      price: mockMenuItem.price,
      restaurantId: mockMenuItem.restaurantId,
      categoryId: mockMenuItem.categoryId
    });
  });

  it('should call addMenuItem when form is submitted and menuItemId is null', () => {
    component.menuItemId = null;
    fixture.detectChanges();
    component.menuForm.setValue({
      name: 'New Menu Item',
      description: 'New Description',
      price: 15,
      restaurantId: 'r2',
      categoryId: '2'
    });

    restaurantService.addMenuItem.and.returnValue(of({} as MenuItem));

    component.onSubmit();

    expect(restaurantService.addMenuItem).toHaveBeenCalledWith({
      name: 'New Menu Item',
      description: 'New Description',
      price: 15,
      restaurantId: 'r2',
      categoryId: '2'
    } as MenuItem);
  });

  it('should call updateMenuItem when form is submitted and menuItemId is not null', () => {
    component.menuItemId = '1';
    fixture.detectChanges();

    restaurantService.updateMenuItem.and.returnValue(of({} as MenuItem));

    component.onSubmit();

    expect(restaurantService.updateMenuItem).toHaveBeenCalledWith('1', {
      name: 'Menu Item 1',
      description: 'Description 1',
      price: 10,
      restaurantId: 'r1',
      categoryId: '1'
    } as MenuItem);
  });

  it('should disable the submit button when the form is invalid', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();

    // Set the form to invalid state
    component.menuForm.controls['name'].setValue('');
    component.menuForm.controls['description'].setValue('');
    component.menuForm.controls['price'].setValue(null);
    component.menuForm.controls['restaurantId'].setValue('');
    component.menuForm.controls['categoryId'].setValue('');
    fixture.detectChanges();

    tick();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTruthy();
  }));

  it('should enable the submit button when the form is valid', () => {
    component.menuForm.controls['name'].setValue('Valid Name');
    component.menuForm.controls['description'].setValue('Valid Description');
    component.menuForm.controls['price'].setValue(10);
    component.menuForm.controls['restaurantId'].setValue('r1');
    component.menuForm.controls['categoryId'].setValue('1');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeFalsy();
  });
});
