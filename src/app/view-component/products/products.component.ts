import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { debounceTime, take, takeLast } from 'rxjs/operators';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { messageTypeEnum, viewTypeEnum } from 'src/app/typing/enum';
import { IProducts } from 'src/app/typing/interfaces';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpclientService,
    private route: Router,
    private ss: SingletonService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    private cdRef: ChangeDetectorRef
  ) {}
  displayedColumns: Array<string> = [
    'serial_no',
    'name',
    'price',
    'createdAt',
    'stock',
    'category',
    'description',
    'ratings',
    'edit',
    'delete',
  ];
  tableDataSource: MatTableDataSource<any>;
  isNoRes: boolean = false;
  Ratings = ['1', '2', '3', '4'];
  priceFilter: string;
  ratingFilter: string;
  pageSizeOptions = [5, 10, 25];
  pageIndex = 0;
  pageSize = 5;
  tableCount = 0;
  hidePageSize: boolean = true;
  searchKeyWord: string;
  selectedType: string = 'list';
  activeIndex;
  rating = ['1', '2', '3', '4'];
  currentViewItem: IProducts;
  @ViewChild('editProductTemp') editProductTemp: TemplateRef<any>;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterTemplate') filterTemplate: TemplateRef<any>;
  @ViewChild('viewDetailTemplate') viewDetailTemplate: TemplateRef<any>;
  availableKeywords: string[] = [
    'all results',
    'samsung',
    'iphone',
    'nokia',
    'macbook',
    'mi pad',
  ];
  totalProdcts: number = 0;
  keyWord = new FormControl();
  PRODUCTS_DATA: Array<IProducts> = [];
  isProductEdit: boolean = false;
  editProductForm: FormGroup;
  fileName: string = '';
  productId: string;
  uploadedFile: File;
  get viewType() {
    return viewTypeEnum;
  }
  ngOnInit(): void {
    this.tableDataSource = new MatTableDataSource<any>([]);
    // this.setEditProducts();
    this.createFormControls();
    this.getAllProducts(false);
  }
  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
    this.keyWord.valueChanges.pipe(debounceTime(400)).subscribe((res) => {
      this.activeIndex = undefined;
      this.searchKeyWord = res.trim();
      this.clearPopupFilter();
      this.getAllProducts(false);
    });
    this.tableDataSource.paginator = this.paginator;
  }

  selectedViewType(e: MatButtonToggleChange) {
    if (e.value != 'filter') {
      this.selectedType = e.value;
    } else {
      console.log('filter is selected');
      this.openFilterPopup();
    }
  }
  setActiveClass(keyWord: string, index: number) {
    this.activeIndex = index;
    this.searchKeyWord = keyWord;
    if (keyWord.toLowerCase() == 'all results') {
      this.searchKeyWord = '';
      this.clearPopupFilter();
    }
    this.getAllProducts(false);
  }

  onListSelChange(e: MatSelectionListChange) {
    this.ratingFilter = e.option.selectionList._value[0];
  }

  handlePageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllProducts(true);
  }
  //setting the custom pageSize by pageMenu
  setPageSize(pagesize: number) {
    debugger;
    this.pageSize = pagesize;
    this.getAllProducts(true);
  }
  clickedRow(rowItem: IProducts) {
    this.currentViewItem = rowItem;
    this.dialogRef = this.ss.DialogBox(
      'Product Details',
      null,
      null,
      this.viewDetailTemplate
    );
    console.log('!!!!', this.currentViewItem);
  }
  priceChange(e: MatRadioChange) {
    this.priceFilter = e.value;
    console.log('------', e.value);
  }
  getAllProducts(isInvokedbypaginator = false) {
    const url = 'products';
    let params = new HttpParams();
    this.tableCount = this.pageIndex = isInvokedbypaginator
      ? this.pageIndex
      : 0;
    if (this.searchKeyWord) {
      params = params.append('keyword', this.searchKeyWord);
    }
    if (this.ratingFilter) {
      params = params.append('ratings[gte]', this.ratingFilter);
    }
    if (this.priceFilter) {
      params = params.append('price[gte]', this.priceFilter);
    }
    params = params.append('page', (this.pageIndex + 1).toString());
    params = params.append('per_page', this.pageSize.toString());
    this.http.request('GET', url, null, params).subscribe((res) => {
      this.isNoRes = true;
      if (res.status == 200) {
        const serverRes = res?.body?.products;
        let cnt = isInvokedbypaginator ? this.pageIndex * this.pageSize + 1 : 1;
        serverRes.map((item: IProducts) => {
          (item.serial_no = cnt), cnt++;
        });
        this.totalProdcts = res?.body?.productCount;
        this.tableDataSource = new MatTableDataSource(serverRes);
        this.PRODUCTS_DATA = serverRes;
      } else if (res.status == 404) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      }
    });
  }

  setEditProducts() {
    const urlparts = this.route.url.split('/');
    const endpoint = urlparts[urlparts.length - 1];
    if (endpoint === 'edit-product') {
      this.isProductEdit = true;
      this.displayedColumns.push('edit', 'delete');
    }
  }
  createFormControls() {
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  editProductPopUp(index: number, event: Event) {
    event.stopPropagation();
    const currentUser = this.PRODUCTS_DATA[index];
    this.productId = currentUser._id;
    this.name.setValue(currentUser.name);
    this.price.setValue(currentUser.price);
    this.description.setValue(currentUser.description);
    this.dialogRef = this.ss.DialogBox(
      'Edit Product',
      null,
      null,
      this.editProductTemp
    );
  }
  get name() {
    return this.editProductForm.get('name');
  }
  get price() {
    return this.editProductForm.get('price');
  }
  get description() {
    return this.editProductForm.get('description');
  }

  //upload userpic
  onFileSelected(event) {
    console.log(event.target.files[0]);
    let file = event.target.files[0];
    this.uploadedFile = file;
    if (file) {
      this.fileName = file?.name;
    }
  }
  //

  editProductFormSubmit() {
    if (this.editProductForm.invalid || !this.productId) {
      return;
    }
    const endPoint = 'products/' + `${this.productId}`;
    const formData = new FormData();
    formData.append('name', this.name.value);
    formData.append('price', this.price.value);
    formData.append('description', this.description.value);
    formData.append('image', this.uploadedFile);
    this.http.request('PUT', endPoint, formData).subscribe((res) => {
      if (res.status === 200) {
        this.ss.message.showStatusBar(
          'Product Updated Successfully',
          3000,
          'success'
        );
        this.dialogClose();
        this.getAllProducts();
        this.uploadedFile = undefined;
      } else if (res.status === 400) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      } else if (res.status === 404) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      } else if (res.status === 500) {
        this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
      }
    });
  }
  dialogClose() {
    this.dialogRef?.close();
  }

  deleteProduct(index, event: Event) {
    event.stopPropagation();
    const currentUser = this.PRODUCTS_DATA[index];
    const id = currentUser._id;
    const endPoint = 'products/' + `${id}`;
    this.ss
      .ConfirmMessage(
        'Confirmation',
        `Are you sure to delete this product`,
        messageTypeEnum.WARN
      )
      .subscribe((res) => {
        if (res) {
          this.http.request('DELETE', endPoint).subscribe((res) => {
            if (res.status === 200) {
              this.ss.message.showStatusBar(
                'Product Deleted Successfully',
                3000,
                'success'
              );
              this.getAllProducts();
            } else if (res.status === 404) {
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

  //opening filter popup
  openFilterPopup() {
    this.ss
      .GeneralPopup(
        'Apply Filters',
        null,
        messageTypeEnum.SUCCESS,
        this.filterTemplate
      )
      .pipe(takeLast(1))
      .subscribe((res) => {
        console.log('oolololololo');
        if (res) {
          this.getAllProducts(false);
        } else {
          this.clearPopupFilter();
        }
      });
  }

  clearPopupFilter() {
    this.ratingFilter = '';
    this.priceFilter = '';
  }
}
