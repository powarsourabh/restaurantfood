import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuFormComponent } from './menu-form/menu-form.component';

const routes: Routes = [
  {path: '', redirectTo:'/restaurants', pathMatch:'full'},
  {path:'restaurants', component:RestaurantListComponent },
  {path:'restaurants/new', component:RestaurantFormComponent},
  {path:'restaurants/edit/:id', component:RestaurantFormComponent},
  {path:'categories', component: CategoryListComponent},
  {path:'categories/new' , component:CategoryFormComponent},
  {path:'categories/edit/:id', component:CategoryFormComponent},
  {path:'menus', component:MenuListComponent},
  {path:'menus/new', component:MenuFormComponent},
  {path:'menus/edit/:id', component:MenuFormComponent},
  {path:'**', component:RestaurantListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
