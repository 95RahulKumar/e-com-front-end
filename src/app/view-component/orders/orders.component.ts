import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { detailExpand, rotateToggle } from 'src/app/animation/animation';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import {
  messageTypeEnum,
  orderStatusEnum,
  paymentStatus,
} from 'src/app/typing/enum';
import {
  IOrderDetails,
  IOrderItem,
  IOrderStatus,
} from 'src/app/typing/interfaces';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [detailExpand, rotateToggle],
})
export class OrdersComponent implements OnInit {
  get orderStatusEnum() {
    return orderStatusEnum;
  }
  get paymentStatus() {
    return paymentStatus;
  }
  editOrderForm: FormGroup;
  @ViewChild('editOrderTemp') editOrderTemp: TemplateRef<any>;
  constructor(
    private http: HttpclientService,
    private ss: SingletonService,
    private route: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.editOrderForm = this.fb.group({
      status: ['Proccessing', Validators.required],
    });
  }
  dataSource: MatTableDataSource<Array<IOrderDetails>> =
    new MatTableDataSource();
  detailsDatasource: MatTableDataSource<Array<IOrderItem>> =
    new MatTableDataSource();
  isOrderEdit: boolean = false;
  ORDERS_DATA: Array<IOrderDetails> = [];
  tableRowOrderId: string;
  columnsToDisplay = [
    'name',
    'OrderItems',
    'PaymentStatus',
    'Address',
    'PaidAt',
    'Tax',
    'ShipingPrice',
    'TotalAmount',
    'OrderStatus',
    'CreatedAt',
    'delete',
  ];
  columnsToDisplayforOrderItems = [
    'id',
    'productId',
    'name',
    'price',
    'quantity',
  ];
  expandedElement: IOrderItem | null;
  hidePassword: boolean = false;
  ngOnInit(): void {
    this.fetchOrderDetails();
    // this.setEditOrders();
  }

  fetchOrderDetails() {
    const url = 'orders';
    this.http.request('GET', url).subscribe((res) => {
      console.log(res.body?.orders);
      const ordersDetails = res.body?.orders;
      this.dataSource.data = ordersDetails;
      this.ORDERS_DATA = [...ordersDetails];
      const [{ orderItems }] = res.body?.orders;
      this.detailsDatasource.data = orderItems;
    });
  }

  setEditOrders() {
    const urlparts = this.route.url.split('/');
    const endpoint = urlparts[urlparts.length - 1];
    console.log('endpoints...', endpoint);
    if (endpoint === 'edit-order') {
      this.isOrderEdit = true;
      this.columnsToDisplay.push('delete');
    }
  }

  updateOrderStatus(index: number, orderId: string) {
    // const currentOrder = this.ORDERS_DATA[id];
    this.tableRowOrderId = orderId;
    console.log(index);
    // this.status.setValue()
    this.dialogRef = this.ss.DialogBox(
      'Edit Order Status',
      null,
      null,
      this.editOrderTemp
    );
  }

  dialogClose() {
    this.dialogRef.close();
  }

  orderStatusFormSubmit() {
    this.tableRowOrderId;
    if (this.editOrderForm.invalid || !this.tableRowOrderId) {
      return;
    }
    const endPoint = 'order/' + `${this.tableRowOrderId}`;
    const payload: IOrderStatus = {
      status: this.editOrderForm.get('status').value,
    };

    this.http.request('PUT', endPoint, payload).subscribe((res) => {
      if (res.status === 200) {
        this.ss.message.showStatusBar(res?.body?.message, 3000, 'success');
        this.dialogClose();
        this.fetchOrderDetails();
      } else if (res.status === 400) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      } else if (res.status === 404) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      } else if (res.status === 500) {
        this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
      }
    });
  }

  deleteOrder(id: string) {
    console.log('id for the order', id);
    const endPoint = 'order/' + `${id}`;
    this.ss
      .ConfirmMessage(
        'Confirmation',
        `Are you sure to delete this order`,
        messageTypeEnum.WARN
      )
      .subscribe((res) => {
        if (res) {
          this.http.request('DELETE', endPoint).subscribe((res) => {
            if (res.status === 200) {
              this.ss.message.showStatusBar(
                res?.body?.message,
                3000,
                'success'
              );
              this.fetchOrderDetails();
            } else if (res.status === 400) {
              this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
            } else if (res.status === 500) {
              this.ss.message.showStatusBar(
                'Internal Server Error',
                3000,
                'fail'
              );
            }
          });
        } else {
          return;
        }
      });
  }
}
