import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusMessageComponent } from './status-message.component';
import { IconModule } from '../custom-icon/icon.module';

@NgModule({
  declarations: [StatusMessageComponent],
  imports: [CommonModule, IconModule],
  exports: [StatusMessageComponent],
})
export class StatusMessageModule {}
