import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CategoryComponent } from './category/category.component';
import { IconModule } from '../shared/custom-icon/icon.module';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewdetailsComponent } from './viewdetails/viewdetails.component';
import { ButtonModule } from '../shared/button-component/button.module';
import { CartComponent } from './cart/cart.component';
@NgModule({
  declarations: [
    ItemlistComponent,
    CategoryComponent,
    ViewdetailsComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    UserRoutingModule,
    IconModule,
    MatIconModule,
    ButtonModule,
  ],
  exports: [ItemlistComponent, CategoryComponent, CartComponent],
})
export class UserModule {}
