import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from "@angular/material/card";
import { Focus } from '../../services/focus';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Layout, TitleCaseDirective } from '../../services/layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { HttpService } from '../../services/http-service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { entry, ledger, transaction, voucher_Type } from '../../datamodels/datamodels';
import { UserService } from '../../services/user-service';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { CommonSrvice } from '../../services/commonService';
import { Router } from '@angular/router';
import { Decorator } from '../../core/services/decorators/decorator';
import { MatTableModule } from "@angular/material/table";
import { last } from 'rxjs';


@Component({
  selector: 'app-transation',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }, DatePipe],
  imports: [MatButtonModule, TitleCasePipe,
    MatFormFieldModule, FormsModule, MatDatepickerModule,
    MatSelectModule, MatInputModule, MatAutocompleteModule,
    ReactiveFormsModule, MatButtonModule, MatCardModule, MatGridListModule, MatIcon, TitleCaseDirective, NgClass, MatTableModule],
  templateUrl: './transation.html',
  styleUrl: './transation.scss'
})
export class Transation implements AfterViewInit {

  // displayedColumns: string[] = ['type', 'account', 'amount', 'narration'];

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 20, 0, 1);
  readonly maxDate = new Date(this._currentYear + 1, 11, 31);

  dateControl = new FormControl(new Date());
  voucher_type: voucher_Type = 'journal';
  Voucher_label: string = '';

  selectedDate: string = '';

  entryForm: FormGroup;
  @ViewChildren('account') account!: QueryList<ElementRef>;

  get entries(): FormArray {
    return this.entryForm.get('entries') as FormArray;
  }

  constructor(private fb: FormBuilder,
    public focus: Focus,
    public layout: Layout,
    private http: HttpService,
    private userService: UserService,
    private commonService: CommonSrvice,
    public router: Router,
    private datePipe: DatePipe,
    private decorater: Decorator
  ) {

    layout.appLayOut.set({
      XSmall: { colspan_1: 2, colspan_2: 3, colspan_3: 3, colspan_4: 4, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      Small: { colspan_1: 2, colspan_2: 3, colspan_3: 3, colspan_4: 4, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      HandsetPortrait: { colspan_1: 4, colspan_2: 4, colspan_3: 4, colspan_4: 3, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      HandsetLandscape: { colspan_1: 4, colspan_2: 6, colspan_3: 4, colspan_4: 3, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      Medium: { colspan_1: 2, colspan_2: 3, colspan_3: 2, colspan_4: 5, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      Large: { colspan_1: 1, colspan_2: 3, colspan_3: 3, colspan_4: 5, colspan_5: 0, colspan_6: 0, rowspan_1: 1 },
      XLarge: { colspan_1: 1, colspan_2: 3, colspan_3: 3, colspan_4: 5, colspan_5: 0, colspan_6: 0, rowspan_1: 1 }
    })

    layout.gridLayout();

    this.entryForm = this.fb.group({
      voucher_Type: new FormControl(),
      entries: this.fb.array([])  // start with empty array
    });
    this.addEntry('debit');

    //  this.getLedger();

  }

  voucherDate: Date = new Date;

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date1 = event.value; // This is a Date object

    if (date1) {
      this.selectedDate = this.datePipe.transform(date1, 'yyyy-MM-dd') || '';
    } else {
      this.selectedDate = '';
    }

    // console.log(this.selectedDate, event.value);

  }


  filteredLedger: ledger[] = [];  
  ngOnInit() {
    this.voucher_type = this.router.url.split('/')[2] as voucher_Type;
    this.Voucher_label = 'Create ' + this.router.url.split('/')[2]+ ' Voucher';
    this.entryForm.markAllAsTouched();

    console.log(this.voucher_type, this.Voucher_label);
    
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.editLedger();
    }, 200);
  }


  toggleField(entryIndex: number, type: 'debit' | 'credit') {
    const entry = this.entries.at(entryIndex);
    this.editLedger()
    if (type === 'debit') {
      entry.get('debit')?.enable();
      entry.get('debit')?.setValidators(Validators.required);

      entry.get('credit')?.reset();
      entry.get('credit')?.disable();
      entry.get('credit')?.clearValidators();

    } else {
      entry.get('credit')?.enable();
      entry.get('credit')?.setValidators(Validators.required);

      entry.get('debit')?.reset();
      entry.get('debit')?.disable();
      entry.get('debit')?.clearValidators();

    }
    entry.get('debit')?.updateValueAndValidity();
    entry.get('credit')?.updateValueAndValidity();
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  addEntry(enable: 'debit' | 'credit' = 'debit', prefill: number | null = null) {
    let trtype: string = enable;
    const item = this.fb.group({
      id: [this.generateId()],
      ledger: new FormControl('', [Validators.required]),
      entry_type: new FormControl(trtype),
      amount: new FormControl(prefill ? prefill : null, [Validators.required]),
      narration: ['']
    });
    this.entries.push(item);
  }

  // originalEntries: entry[] = [];
  transactionId: number | null = null;
  editLedger() {
    let sp = this.router.url.substring(1).split('/')[1];
    // console.log(this.router.url.substring(1).split('/')[1]);
    if (this.router.url.substring(1).split('/')[1] != undefined) {
      this.transactionId = parseInt(sp);
    } else {
      // this.Voucher_label = 'Add ' + this.router.url.substring(3) + ' Voucher';
    }

    if (this.router.url.substring(1) == `transaction/${sp}`) {
      this.http.get<transaction>(`${this.router.url.substring(1)}/`).subscribe((value1: transaction) => {
        // console.log(value1);
        this.dateControl.setValue(new Date(value1.date))
        this.voucher_type = value1.voucher_type as voucher_Type;
        this.Voucher_label = 'edit ' + value1.voucher_type + ' Voucher';
        this.entries.clear();
        for (let a in value1.entries) {
          let LedgerV = this.userService.selectedCompanyLedgerList().filter(o => o.id == value1.entries[a].ledger);
          let tt = this.fb.group({
            id: [value1.entries[a].id],
            ledger: LedgerV,
            entry_type: value1.entries[a].entry_type,
            amount: value1.entries[a].amount,
            narration: value1.entries[a].narration,
          })

          this.entries.push(tt);
          // this.originalEntries.push(value1.entries[a]);
        }
      })
    }

  }

  displayFn = (account: ledger): string => {
    if (!account || !account.name) return '';
    return this.decorater.toTitleCase(account.name);
  }
  selectedAccount1: number | undefined = 0;

  selectedAccount(value: string) {

    this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(value));
    this.selectedAccount1 = this.filteredLedger[0].id
  }

  filter(index: number, value: string) {
    const filterValue = value.toLowerCase();
    const entry = this.entries.at(index);
    const entry_type = entry.get('entry_type')?.value

    if (this.voucher_type.toLowerCase() == 'payment' && entry_type != 'debit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'bank accounts' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'cash-in-hand');
    }
    else if (this.voucher_type.toLowerCase() == 'payment' && entry_type != 'credit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry debtors' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry creditors');
    }
    else if (this.voucher_type.toLowerCase() == 'receipt' && entry_type != 'credit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'bank accounts' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'cash-in-hand');
    }
    else if (this.voucher_type.toLowerCase() == 'receipt' && entry_type != 'debit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry debtors' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry creditors');
    }
    else if (this.voucher_type.toLowerCase() == 'sale' && entry_type != 'debit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sales accounts');
    }
    else if (this.voucher_type.toLowerCase() == 'sale' && entry_type != 'credit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry debtors' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry creditors');
    }
    else if (this.voucher_type.toLowerCase() == 'purchase' && entry_type == 'debit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'purchase accounts');
    }
    else if (this.voucher_type.toLowerCase() == 'purchase' && entry_type == 'credit') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry debtors' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'sundry creditors');
    }
    else if (this.voucher_type.toLowerCase() == 'journal') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue));
    }
    else if (this.voucher_type.toLowerCase() == 'contra') {
      this.filteredLedger = this.userService.selectedCompanyLedgerList().filter(o => o.name.toLowerCase().includes(filterValue) && o.parent_name == 'bank accounts' || o.name.toLowerCase().includes(filterValue) && o.parent_name == 'cash-in-hand');
    }

    // console.log(this.filteredLedger);

  }

  // Remove field
  removeEntry(id: number) {
    const index = this.entries.controls.findIndex(ctrl => ctrl.get('id')?.value === id);
    if (index !== -1) {
      this.entries.removeAt(index);
    }
    console.log(index);

  }

  getTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    this.entries.controls.forEach(entry => {
      if (entry.get('entry_type')?.value == 'debit') {
        const d = Number(entry.get('amount')?.value || 0);
        totalDebit += isNaN(d) ? 0 : d;
      } else {
        const c = Number(entry.get('amount')?.value || 0);
        totalCredit += isNaN(c) ? 0 : c;
      }
    });

    return { totalDebit, totalCredit };
  }

  checkBalanceAndAdd(index:any) {
    const { totalDebit, totalCredit } = this.getTotals();
    const lastEntry = this.entries.at(this.entries.length - 1);
    const Entry_rosw = this.entries.at(this.entries.length-1)    
    console.log(this.entries.length, index);
    
    
    let lastDebit = 0;
    let lastCredit = 0;
    const dc = lastEntry.get('entry_type')?.value
    if (dc == 'debit') {
      lastDebit = parseFloat(lastEntry.get('amount')?.value);
      // console.log(lastDebit);
    } else {
      lastCredit = parseFloat(lastEntry.get('amount')?.value);
      // console.log(lastCredit);
    }

    // 🔒 do nothing if last entry is empty or 0
    // if ((isNaN(lastDebit) || lastDebit <= 0) && (isNaN(lastCredit) || lastCredit <= 0)) {
    //   console.log('Last entry is empty or zero, not adding balancing entry.');
    //   // return;
    // }else{
    //   console.log('Last entry has value, proceeding to check balance.');
    // }

    // add balancing entry only when totals mismatch
    if (totalDebit > totalCredit) {
      const diff = totalDebit - totalCredit;
      if (diff > 0) {
       if(index == this.entries.length -1){
        this.addEntry('credit', diff);
      }
        this.entryForm.markAllAsTouched();
       
        
      }
    } else if (totalCredit > totalDebit) {
      const diff = totalCredit - totalDebit;
      if (diff > 0) {
       if(index == this.entries.length -1){
        this.addEntry('debit', diff);}
        this.entryForm.markAllAsTouched();
      }
    }

    setTimeout(() => {
      this.account.get(this.entries.length - 1)?.nativeElement.focus();
    });

  }

  submit() {
    this.selectedDate = this.datePipe.transform(this.dateControl.value, 'yyyy-MM-dd') || '';
    const { totalDebit, totalCredit } = this.getTotals();
    if (totalDebit !== totalCredit) {
      console.log('Not balanced, fixing...');
      this.checkBalanceAndAdd('');
      return;
    }

    if (this.entryForm.valid) {
      let entries: entry[] = [];
      let currentEntries: entry[] = [];
      this.entryForm.value.entries.forEach((element: any) => {
        let id;
        if (element.id && typeof element.id !== 'string') {
          id = element.id;
        }

        entries.push({
          ledger: element.ledger.id,
          entry_type: element.entry_type,
          amount: element.amount,
          narration: element.narration
        })

        currentEntries.push({
          id: id,
          ledger: element.ledger.id,
          entry_type: element.entry_type,
          amount: element.amount,
          narration: element.narration
        })
      });

     
      let data1: transaction = {
        "voucher_no": "pay001",
        "voucher_type": this.voucher_type,
        "date": this.selectedDate,
        "narration": "fromrow",
        "entries": entries
        // this.entryForm.value.entries

      }

      const payload = {
        "date": this.selectedDate,
        "voucher_type": this.voucher_type,
        "entries": currentEntries,
        "narration": "fromrow",
      };

      if (this.transactionId != null) {
        this.http.put<any>(`transaction/${this.transactionId}/`, payload).subscribe((value) => {
          this.commonService.snackBar(`Entry Updated Successfully`, '', 3000)
          window.history.back();

        });
      } else {
        if (this.selectedDate != undefined) {
          this.http.post<transaction>('transaction/', data1).subscribe((value) => {
            this.commonService.snackBar(`Entry Success ${value.voucher_type}`, '', 3000)
          });
        }
        else {
          this.commonService.snackBar(`Please Select Date`, '', 3000);
        }
      }

    }
    else {
      console.log('Form Invalid');
    }
  }

  private inputArray: HTMLInputElement[] = [];
  focusPreviousIfEmpty(index: number) {
    if (index === 0) return; // no previous
    const prevInput = this.inputArray[index - 1];
    if (!prevInput) return;
    // if previous is empty, focus it
    if (!prevInput.value || prevInput.value.trim() === '') {
      console.log(!prevInput.value);
      prevInput.focus();
    }
  }
}


export interface AccountingEntry {
  id: number;
  type: 'Dr' | 'Cr';
  account: string;
  amount: number;
  narration: string;
}