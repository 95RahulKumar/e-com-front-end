import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../shared/custom-icon/icon.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { MaterialModule } from '../shared/material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../shared/button-component/button.module';
import { MatDialogRef } from '@angular/material/dialog';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RangepickerheaderModule } from '../shared/rangepickerheader/rangepickerheader.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [
    AddProductComponent,
    UsersComponent,
    OrdersComponent,
    DashboardComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    IconModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    NgApexchartsModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatCheckboxModule,
    RangepickerheaderModule,
    NgCircleProgressModule.forRoot({
      radius: 60,
      space: -10,
      innerStrokeWidth: 10,
      titleColor: '#dedede',
      unitsColor: '#dedede',
      animateTitle: true,
      showUnits: false,
      showBackground: false,
      showSubtitle: false,
      clockwise: true,
      startFromZero: false,
      lazy: true,
    }),
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  // exports: [
  //   AddProductComponent,
  //   UsersComponent,
  //   OrdersComponent,
  //   DashboardComponent,
  //   ProductsComponent,
  // ],
})
export class AdminModule {}
