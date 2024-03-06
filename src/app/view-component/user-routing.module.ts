import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { ViewdetailsComponent } from './viewdetails/viewdetails.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'offer',
    component: ItemlistComponent,
  },
  {
    path: 'fan',
    component: ItemlistComponent,
  },
  {
    path: 'printer',
    component: ItemlistComponent,
  },
  {
    path: 'ac',
    component: ItemlistComponent,
  },
  {
    path: 'laptop',
    component: ItemlistComponent,
  },
  {
    path: 'camera',
    component: ItemlistComponent,
  },
  {
    path: 'smartwatch',
    component: ItemlistComponent,
  },

  {
    path: 'mobile',
    component: ItemlistComponent,
  },
  {
    path: 'power-bank',
    component: ItemlistComponent,
  },
  {
    path: 'antivirus',
    component: ItemlistComponent,
  },
  {
    path: 'veg',
    component: ItemlistComponent,
  },
  {
    path: 'order',
    component: ItemlistComponent,
  },
  {
    path: 'view-details',
    component: ViewdetailsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'wishlist',
    component: ItemlistComponent,
  },
  {
    path: 'notification',
    component: ItemlistComponent,
  },

  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
