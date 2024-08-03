import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from './restaurant.service';
import { Category } from 'models/category.model';
import { MenuItem } from 'models/menu.model';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService]
    });
    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve restaurants', () => {
    const mockRestaurants = [{ id: 1, name: 'Restaurant 1' }, { id: 2, name: 'Restaurant 2' }];
    service.getRestaurants().subscribe(restaurants => {
      expect(restaurants).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne('http://localhost:3000/restaurants');
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants);
  });

  it('should retrieve a restaurant by ID', () => {
    const mockRestaurant = { id: 1, name: 'Restaurant 1' };
    service.getRestaurant('1').subscribe(restaurant => {
      expect(restaurant).toEqual(mockRestaurant);
    });

    const req = httpMock.expectOne('http://localhost:3000/restaurants/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurant);
  });

  it('should add a new restaurant', () => {
    const newRestaurant = { name: 'New Restaurant' };
    service.addRestaurant(newRestaurant).subscribe(response => {
      expect(response).toEqual(newRestaurant);
    });

    const req = httpMock.expectOne('http://localhost:3000/restaurants');
    expect(req.request.method).toBe('POST');
    req.flush(newRestaurant);
  });

  it('should update an existing restaurant', () => {
    const updatedRestaurant = { id: 1, name: 'Updated Restaurant' };
    service.updateRestaurant('1', updatedRestaurant).subscribe(response => {
      expect(response).toEqual(updatedRestaurant);
    });

    const req = httpMock.expectOne('http://localhost:3000/restaurants/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedRestaurant);
  });

  it('should delete a restaurant', () => {
    service.deleteRestaurant(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/restaurants/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve categories', () => {
    const mockCategories: Category[] = [{ id: '1', name: 'Category 1' }, { id: '2', name: 'Category 2' }];
    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:3000/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should add a new category', () => {
    const newCategory: Category = { id: '1', name: 'New Category' };
    service.addCategory(newCategory).subscribe(response => {
      expect(response).toEqual(newCategory);
    });

    const req = httpMock.expectOne('http://localhost:3000/categories');
    expect(req.request.method).toBe('POST');
    req.flush(newCategory);
  });

  it('should update an existing category', () => {
    const updatedCategory: Category = { id: '1', name: 'Updated Category' };
    service.updateCategory('1', updatedCategory).subscribe(response => {
      expect(response).toEqual(updatedCategory);
    });

    const req = httpMock.expectOne('http://localhost:3000/categories/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCategory);
  });

  it('should delete a category', () => {
    service.deleteCategory('1').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/categories/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve menu items', () => {
    const mockMenuItems: MenuItem[] = [{ id: '1', name: 'MenuItem 1', description: 'Description', price: 10, categoryId: '1', restaurantId: '1' }];
    service.getMenuItems('1').subscribe(menuItems => {
      expect(menuItems).toEqual(mockMenuItems);
    });

    const req = httpMock.expectOne('http://localhost:3000/menus?restaurantId=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMenuItems);
  });

  it('should add a new menu item', () => {
    const newMenuItem: MenuItem = { id: '1', name: 'New MenuItem', description: 'Description', price: 10, categoryId: '1', restaurantId: '1' };
    service.addMenuItem(newMenuItem).subscribe(response => {
      expect(response).toEqual(newMenuItem);
    });

    const req = httpMock.expectOne('http://localhost:3000/menus');
    expect(req.request.method).toBe('POST');
    req.flush(newMenuItem);
  });

  it('should update an existing menu item', () => {
    const updatedMenuItem: MenuItem = { id: '1', name: 'Updated MenuItem', description: 'Description', price: 10, categoryId: '1', restaurantId: '1' };
    service.updateMenuItem('1', updatedMenuItem).subscribe(response => {
      expect(response).toEqual(updatedMenuItem);
    });

    const req = httpMock.expectOne('http://localhost:3000/menus/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedMenuItem);
  });

  it('should delete a menu item', () => {
    service.deleteMenuItem('1').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/menus/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
