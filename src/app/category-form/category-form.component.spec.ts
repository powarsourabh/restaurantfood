import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CategoryFormComponent } from './category-form.component';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute, Routes } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let restaurantService: jasmine.SpyObj<RestaurantService>;

  const routes: Routes = [
    { path: 'categories', component: CategoryFormComponent }
  ];

  beforeEach(async () => {
    const restaurantServiceSpy = jasmine.createSpyObj('RestaurantService', ['getCategories', 'addCategory', 'updateCategory']);

    await TestBed.configureTestingModule({
      declarations: [CategoryFormComponent],
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

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;

    // Mock getCategories method
    restaurantService.getCategories.and.returnValue(of([
      { id: '1', name: 'Test Category' }
    ]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with category data if categoryId is provided', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categoryForm.value).toEqual({
      name: 'Test Category'
    });
  });

  it('should display required error message if name field is touched but empty', () => {
    restaurantService.getCategories.and.returnValue(of([
      { id: '1', name: '' }
    ]));
    const name = component.categoryForm.controls['name'];
    name.markAsTouched();
    name.setValue(''); // Set the value to an empty string to trigger validation
    fixture.detectChanges();

    expect(name.invalid).toBeTruthy();
  });

  it('should add a new category on submit', () => {
    component.categoryId = null;
    const addCategorySpy = restaurantService.addCategory.and.returnValue(of({
      id: '', name: ''
    }));
    const newCategory = { id: '2', name: 'New Category' };
    component.categoryForm.setValue({
      name: newCategory.name
    });

    component.onSubmit();

    expect(addCategorySpy).toHaveBeenCalledWith(jasmine.objectContaining({
      name: newCategory.name
    }));
  });

  it('should update an existing category on submit', () => {
    component.categoryId = '1';
    const updateCategorySpy = restaurantService.updateCategory.and.returnValue(of({
      id: '', name: ''
    }));
    const updatedCategory = { id: '1', name: 'Updated Category' };
    component.categoryForm.setValue({
      name: updatedCategory.name
    });

    component.onSubmit();

    expect(updateCategorySpy).toHaveBeenCalledWith(updatedCategory.id, jasmine.objectContaining({
      name: updatedCategory.name
    }));
  });
});
