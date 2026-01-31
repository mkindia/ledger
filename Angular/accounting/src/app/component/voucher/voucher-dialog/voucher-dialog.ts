import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher-dialog',
   providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }, DatePipe],
  imports: [MatIcon,  MatDatepickerModule,
    MatSelectModule, MatInputModule, 
    MatAutocompleteModule, MatDialogActions, 
    MatButtonModule,MatDatepickerInput,  
    MatDatepicker, MatDialogModule, TitleCasePipe
    ],
  templateUrl: './voucher-dialog.html',
  styleUrl: './voucher-dialog.scss',
})
export class VoucherDialog {
  readonly dialogRef = inject(MatDialogRef<VoucherDialog>);
  
  voucher_type = '';
  constructor(public router: Router ) {
    this.dialogRef.disableClose = true;

  }

  ngOnInit(){
    this.voucher_type = this.router.url.split('/')[2]
  }

  submit(){
    console.log(this.voucher_type);
    console.log('hi');
    
  }


}
