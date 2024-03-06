import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'product',
    component: AddProductComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  // {
  //   path: 'edit-product',
  //   component: ProductsComponent,
  // },
  {
    path: 'users',
    component: UsersComponent,
  },
  // {
  //   path: 'edit-user',
  //   component: UsersComponent,
  // },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  // {
  //   path: 'edit-order',
  //   component: OrdersComponent,
  // },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
