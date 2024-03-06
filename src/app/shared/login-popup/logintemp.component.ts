import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { UserService } from 'src/app/services/user.service';
import {
  DialogData,
  IForgotPaassword,
  IUserLogin,
  IUserRegistration,
} from 'src/app/typing/interfaces';

@Component({
  selector: 'app-logintemp',
  templateUrl: './logintemp.component.html',
  styleUrls: ['./logintemp.component.scss'],
})
export class LogintempComponent implements OnInit {
  isForgotPassword: boolean = false;
  isLoginForm: boolean = true;
  mergeData: DialogData;
  userRegistrationForm!: FormGroup;
  userLoginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  hidePassword: boolean = true;
  fileName: string = '';
  uploadedFile: File;
  GENDER: Array<string> = ['male', 'female', 'others'];
  constructor(
    private fb: FormBuilder,
    private httpClient: HttpclientService,
    private user: UserService,
    private ss: SingletonService,
    private cookie: CookieService,
    public dilogRef: MatDialogRef<any>,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.createAllFormControl();
    this.mergeData = { ...this.data };
    this.userRegistrationForm.get('gender').setValue('Male');
  }

  toggleUserForm() {
    this.isLoginForm = !this.isLoginForm;
    this.isForgotPassword = false;
  }
  //creating form control
  createAllFormControl() {
    this.userRegistrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['male', [Validators.required]],
    });

    this.userLoginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ],
      ],
    });
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

  registerFormSubmit() {
    if (this.userRegistrationForm.invalid) {
      return;
    }
    const endPoint = 'register';
    const formData = new FormData();
    formData.append('name', this.userRegistrationForm.get('name').value);
    formData.append('email', this.userRegistrationForm.get('email').value);
    formData.append(
      'password',
      this.userRegistrationForm.get('password').value
    );
    formData.append(
      'gender',
      this.userRegistrationForm.get('gender').value.toLowerCase()
    );
    formData.append('avatar', this.uploadedFile);
    this.httpClient.request('POST', endPoint, formData).subscribe((res) => {
      if (res.status === 201) {
        this.ss.message.showStatusBar(
          'User Created Successfully',
          3000,
          'success'
        );
        this.dilogRef.close();
        this.resettingSidebar(res.body.token);
      }
      if (res.status === 500) {
        this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
      }
    });
    // logic for register
  }

  loginFormSubmit() {
    console.log('user login form', this.userLoginForm);
    if (this.userLoginForm.invalid) {
      return;
    }
    const endPoint = 'login';
    const payload: IUserLogin = {
      email: this.userLoginForm.get('email').value,
      password: this.userLoginForm.get('password').value,
    };
    // closing the ppopup
    //logic for login
    this.httpClient.request('POST', endPoint, payload).subscribe((res) => {
      if (res.status === 200) {
        this.ss.message.showStatusBar(
          'User Login Successfully',
          3000,
          'success'
        );

        this.resettingSidebar(res.body.token);
        this.dilogRef.close();
      } else if (res.status === 400) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      } else if (res.status === 401) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      }
    });
  }
  forgotPasswordFormSubmit() {
    if (this.forgotPasswordForm) {
      return;
    }
    const endPoint = '/reset/password';
    const payload: IForgotPaassword = {
      email: this.forgotPasswordForm.get('email').value,
    };
    //closing popup
    this.dilogRef.close();
    // logic for forgot password
    this.httpClient.request('POST', endPoint, payload).subscribe((res) => {
      console.log(res);
    });
  }

  forgotPassword() {
    this.isForgotPassword = true;
  }

  resettingSidebar(token?: string) {
    this.user.setItem('token', token);
    const role = this.user.getUserRole();
    this.user.setItem('role', role);
    const activerole = this.user.getItem('role');
    this.ss.isLogin$.next(true);
    this.route.navigateByUrl(activerole);
  }

  closeDialog() {
    this.dilogRef.close();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
