import { HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { RangepickerheaderComponent } from 'src/app/shared/rangepickerheader/rangepickerheader.component';
import { messageTypeEnum } from 'src/app/typing/enum';
import { IUsers } from 'src/app/typing/interfaces';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  range!: FormGroup;
  autoComp!: FormGroup;
  constructor(
    private http: HttpclientService,
    private route: Router,
    private ss: SingletonService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    private cdRef: ChangeDetectorRef
  ) {
    this.range = new FormGroup({
      start: new FormControl(Validators.required),
      end: new FormControl(Validators.required),
    });
    this.autoComp = this.fb.group({
      inputVal: ['All', Validators.required],
    });
  }
  displayedColumns: Array<string> = [
    'id',
    'name',
    'email',
    'gender',
    'createdAt',
    'role',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<Array<IUsers>> = new MatTableDataSource();
  @ViewChild('editProductTemp') editUserTemp: TemplateRef<any>;

  filteredOptions: Observable<string[]>;

  readonly RangepickerheaderComponent = RangepickerheaderComponent;

  userCount: number;
  USERS_DATA: Array<IUsers> = [];
  userName: Array<string> = [];
  ROLES: Array<string> = ['admin', 'user'];
  isUserEdit: boolean = false;
  editUserForm: FormGroup;
  fileName: string = '';
  userId: string;
  uploadedFile: File;

  ngOnInit(): void {
    this.getAllProducts();
    // this.setEditUsers();
    this.createFormControls();
    this.filteredOptions = this.autoComp.get('inputVal').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  getAllProducts() {
    const url = 'users';
    this.http.request('GET', url).subscribe((res) => {
      if (res.status == 200) {
        this.userName = [];
        this.userCount = res?.body?.users.length;
        const users = res?.body?.users;
        this.dataSource.data = users;
        this.USERS_DATA = users;
        this.USERS_DATA.forEach((ele) => {
          this.userName.push(ele.name);
        });
        this.userName.unshift('all');
      } else if (res.status == 400) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      }
    });
  }

  setEditUsers() {
    const urlparts = this.route.url.split('/');
    const endpoint = urlparts[urlparts.length - 1];
    if (endpoint === 'edit-user') {
      this.isUserEdit = true;
      this.displayedColumns.push('edit', 'delete');
    }
  }
  createFormControls() {
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
    console.log();
  }
  editUserPopUp(index: number) {
    const currentUser = this.USERS_DATA[index];
    console.log('$$$$', currentUser);
    this.userId = currentUser._id;
    this.name.setValue(currentUser.name);
    this.email.setValue(currentUser.email);
    this.editUserForm.get('role').patchValue(currentUser.role);
    this.cdRef.detectChanges();
    this.dialogRef = this.ss.DialogBox(
      'Edit User',
      null,
      null,
      this.editUserTemp
    );
  }
  get name() {
    return this.editUserForm.get('name');
  }
  get email() {
    return this.editUserForm.get('email');
  }
  get role() {
    return this.editUserForm.get('role');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.userName.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  applyFilter(event: MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.trim().toLowerCase();
    this.dataSource.filter = filterValue == 'all' ? '' : filterValue;
  }
  //upload userpic
  // onFileSelected(event) {
  //   console.log(event.target.files[0]);
  //   let file = event.target.files[0];
  //   this.uploadedFile = file;
  //   if (file) {
  //     this.fileName = file?.name;
  //   }
  // }
  //

  editUserFormSubmit() {
    if (this.editUserForm.invalid || !this.userId) {
      return;
    }
    const endPoint = 'user/' + `${this.userId}`;
    this.http
      .request('PUT', endPoint, this.editUserForm.value)
      .subscribe((res) => {
        if (res.status === 200) {
          this.ss.message.showStatusBar(res?.body?.message, 3000, 'success');
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

  deleteUser(index) {
    const currentUser = this.USERS_DATA[index];
    const id = currentUser._id;
    const endPoint = 'user/' + `${id}`;
    this.ss
      .ConfirmMessage(
        'Confirmation',
        `Are you sure to delete this user`,
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
              this.getAllProducts();
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
  fileDownload() {
    const endPoint = 'users/download';
    const reqHeader = new HttpHeaders({
      'Content-Type': 'text/csv',
    });
    this.http
      .request('GET', endPoint, null, null, {
        headers: reqHeader,
        responseType: 'blob',
      })
      .subscribe((res) => {
        if (res.status === 200) {
          console.log('@@@@@@', res);
          const blob = new Blob([res.error.text], { type: 'application/csv' });
          saveAs(blob, 'users.csv');
        } else if (res.status === 500) {
          this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
        } else {
          this.ss.message.showStatusBar(
            `Failed with server status code ${res.status} see console`,
            3000,
            'fail'
          );
        }
      });
  }
  dateRangeChange() {
    if (this.range.get('start')?.value && this.range.get('end')?.value) {
      console.log(
        'date values are ...',
        this.range.get('start')?.value,
        this.range.get('end')?.value
      );
    }
  }

  clear() {
    this.autoComp.reset();
  }
}
