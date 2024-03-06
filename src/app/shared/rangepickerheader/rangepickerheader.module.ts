import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangepickerheaderComponent } from './rangepickerheader.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [RangepickerheaderComponent],
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // here order matters it first excuete the auth interceptor
    // then it will excecute the login interceptor
  ],
  exports: [RangepickerheaderComponent],
})
export class RangepickerheaderModule {}
