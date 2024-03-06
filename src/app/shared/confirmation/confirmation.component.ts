import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { messageTypeEnum } from 'src/app/typing/enum';
import { DialogData } from 'src/app/typing/interfaces';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  DefaultData: DialogData = {
    title: 'Confirmation',
    message: 'Do you want to Proceed?',
    type: messageTypeEnum.SUCCESS,
  };
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  get messageTypeEnum() {
    return messageTypeEnum;
  }
  mergeData = { ...this.DefaultData, ...this.data };
  ngOnInit(): void {
    console.log('mergeddata', this.mergeData);
  }

  // closeDialog() {
  //   this.dialogRef.close();
  // }
  // clickOnProceed() {
  //   this.dialogRef.close(true);
  // }
}
