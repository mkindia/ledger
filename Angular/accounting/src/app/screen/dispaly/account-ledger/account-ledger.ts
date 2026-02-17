import { Component, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { AccountTransaction, ledger } from '../../../datamodels/datamodels';
import { MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe, DecimalPipe, TitleCasePipe, NgClass } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { KeyboardNavDirective } from "../../../core/directives/keyboard-nav.directive";
import { Voucher } from '../../../core/services/voucher_services/voucher';
import { HttpService } from '../../../core/services/http-service';


@Pipe({ name: 'abs', standalone: true })
export class AbsPipe implements PipeTransform {
  transform(value: number | null | undefined): number {
    return Math.abs(value ?? 0);
  }
}

@Component({
  selector: 'app-account-ledger',
  imports: [MatTableModule, DatePipe, MatRippleModule, DecimalPipe, TitleCasePipe, MatCardModule, TitleCasePipe, NgClass, AbsPipe, KeyboardNavDirective],
  templateUrl: './account-ledger.html',
  styleUrl: './account-ledger.scss',
})
export class AccountLedger { 
  displayedColumns = [
    'date',
    'voucherType',
    'voucherNo',
    'account',
    'debit',
    'credit',
    'balance',
    'narration'
  ];

  data1: AccountTransaction[] = [];
  Account_name: String = '';
  dataSource = new MatTableDataSource<any>([]);
  TotalDebit: number = 0;
  TotalCredit: number = 0;

  constructor(private router: Router, private http: HttpService, private voucherService: Voucher) {
    this.http.get<ledger>(this.router.url + '/').subscribe(value => {     
      this.Account_name = value.name.toUpperCase();
    })

    this.http.get<AccountTransaction[]>(this.router.url + '/entries/').subscribe((value1: AccountTransaction[]) => {
      let balance = 0;
      this.dataSource.data = value1.map(tx => {
        this.TotalDebit += tx.debit > 0 ? tx.debit : 0;
        this.TotalCredit += tx.credit > 0 ? tx.credit : 0;
        balance += tx.debit > 0 ? tx.debit : -tx.credit;
        return { ...tx, balance };       

      });     
    })
  }

  ngOnInit(){
    
  }

  // @ViewChildren(MatRow,{read: ElementRef}) rows!: QueryList<ElementRef>;

  ngAfterViewInit(){
    setTimeout(() => {   
    this.focusRow(this.activeIndex);
    }, 500);
    
  }


  activeIndex = 0;
  onRowKeydown(event: KeyboardEvent, index: number) {
    switch (event.key) {

      case 'ArrowDown':
        event.preventDefault();
        this.focusRow(index + 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusRow(index - 1);
        break;

      case 'Home':
        event.preventDefault();
        this.focusRow(0);
        break;

      case 'End':
        event.preventDefault();
        this.focusRow(this.dataSource.data.length - 1);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectRow(index);
        break;
    }
  }

  focusRow(index: number) {
    if (index < 0 || index >= this.dataSource.data.length) return;

    this.activeIndex = index;
    const rows = document.querySelectorAll<HTMLTableRowElement>('tr[mat-row]');
    rows[index]?.focus();
  }

  selectRow(index: number) {
    this.voucherService.selectedVoucher_code.set({ code:this.dataSource.data[index].voucher_type, name:this.dataSource.data[index].voucher_type})
    this.router.navigate([`transaction/${this.dataSource.data[index].transaction}`])
  }


}
