import { TitleCasePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ledger } from '../../datamodels/datamodels';
import { HttpService } from '../../services/http-service';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { AccountList } from '../account/account-list/account-list';

@Component({
  selector: 'app-list-of-ledger',
  imports: [MatDialogModule, MatFormFieldModule,
    MatButtonModule, MatIconModule, AccountList],
  templateUrl: './list-of-ledger.html',
  styleUrl: './list-of-ledger.scss',
})
export class ListOfLedger {
  readonly dialogRef = inject(MatDialogRef<ListOfLedger>);

  @ViewChild(AccountList) accountAutocomplete!: AccountList;

  constructor(private http: HttpService, public userService: UserService, private router: Router) {
    this.dialogRef.disableClose = true;
  }

  filteredLedger: ledger[] = [];
  allLedger: ledger[] = [];
  selectedAccountValue = "";

  ngOnInit(){
    this.userService.getSelectedCompanyLedger();
    console.log(this.userService.selectedCompanyLedgerList());
    
  }


  filter(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue));
    //  this.selectedAccountValue = this.filteredLedger[0].name;
  }

  selectedAccount() {
    this.router.navigate(["/"])
    // console.log(value);
    // this.selectedAccountValue = value.name;
    setTimeout(() => {
      this.router.navigate(["/ledger", this.accountAutocomplete.accountControl.value.id]);
      this.dialogRef.close();
    }, 100);
   // console.log(this.accountAutocomplete.accountControl.value.id);
    
  }

}
