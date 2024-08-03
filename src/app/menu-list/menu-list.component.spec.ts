import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { RestaurantService } from '../restaurant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Category } from 'models/category.model';
import { MenuItem } from 'models/menu.model';

describe('MenuListComponent', () => {
  let component: MenuListComponent;
  let fixture: ComponentFixture<MenuListComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;

  const mockCategories: Category[] = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  const mockRestaurants: any[] = [
    { id: 'r1', name: 'Restaurant 1' },
    { id: 'r2', name: 'Restaurant 2' }
  ];

  const mockMenuItems: MenuItem[] = [
    { id: '1', name: 'Menu Item 1', description: 'Description 1', price: 10, categoryId: '1', restaurantId: 'r1' },
    { id: '2', name: 'Menu Item 2', description: 'Description 2', price: 20, categoryId: '2', restaurantId: 'r2' }
  ];

  beforeEach(async () => {
    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getMenuItems', 'getCategories', 'getRestaurant', 'deleteMenuItem']);

    await TestBed.configureTestingModule({
      declarations: [MenuListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuListComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    // Mock the getMenuItems, getCategories, and getRestaurant methods
    restaurantService.getMenuItems.and.returnValue(of(mockMenuItems));
    restaurantService.getCategories.and.returnValue(of(mockCategories));
    restaurantService.getRestaurant.and.returnValue(of(mockRestaurants));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items, categories, and restaurants on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.menuItems).toEqual(mockMenuItems);
    expect(component.categories).toEqual(mockCategories);
    expect(component.restaurants).toEqual(mockRestaurants);
  });

  it('should display menu items', () => {
    fixture.detectChanges();
    const menuItems = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].nativeElement.textContent).toContain('Menu Item 1');
    expect(menuItems[1].nativeElement.textContent).toContain('Menu Item 2');
  });

  it('should display correct category name for each menu item', () => {
    fixture.detectChanges();
    const categoryNames = fixture.debugElement.queryAll(By.css('tbody tr td:nth-child(5)'));
    expect(categoryNames[0].nativeElement.textContent).toBe('Category 1');
    expect(categoryNames[1].nativeElement.textContent).toBe('Category 2');
  });

  it('should display correct restaurant name for each menu item', () => {
    fixture.detectChanges();
    const restaurantNames = fixture.debugElement.queryAll(By.css('tbody tr td:nth-child(4)'));
    expect(restaurantNames[0].nativeElement.textContent).toBe('Restaurant 1');
    expect(restaurantNames[1].nativeElement.textContent).toBe('Restaurant 2');
  });

  it('should delete a menu item', (done) => {
    restaurantService.deleteMenuItem.and.returnValue(of(void 0)); // Ensure it returns Observable<void>
    fixture.detectChanges();

    // Ensure initial menu items are as expected
    expect(component.menuItems.length).toBe(2);

    component.onDelete('1');
    fixture.detectChanges();

    // Wait for the asynchronous operation to complete
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.menuItems.length).toBe(1);
      expect(component.menuItems.find(menuItem => menuItem.id === '1')).toBeUndefined();
      done();
    });
  });

  it('should call deleteMenuItem when delete button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'onDelete').and.callThrough();
    const deleteButtons = fixture.debugElement.queryAll(By.css('.btn-danger'));
    deleteButtons[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.onDelete).toHaveBeenCalledWith('1');
    expect(restaurantService.deleteMenuItem).toHaveBeenCalledWith('1');
  });

  it('getCategoryName should return correct category name', () => {
    fixture.detectChanges(); // Ensure ngOnInit is called and categories are loaded
    expect(component.getCategoryName('1')).toBe('Category 1');
    expect(component.getCategoryName('2')).toBe('Category 2');
    expect(component.getCategoryName('3')).toBe('');
  });

  it('getRestaurantName should return correct restaurant name', () => {
    fixture.detectChanges(); // Ensure ngOnInit is called and restaurants are loaded
    expect(component.getRestaurantname('r1')).toBe('Restaurant 1');
    expect(component.getRestaurantname('r2')).toBe('Restaurant 2');
    expect(component.getRestaurantname('r3')).toBe('');
  });
});
