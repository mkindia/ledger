import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormBuilder, FormArray } from "@angular/forms";

@Component({
  selector: 'app-drcr',
  imports: [MatButtonModule,
    MatFormFieldModule, FormsModule,
    MatSelectModule, MatInputModule,
    ReactiveFormsModule,],
  templateUrl: './drcr.html',
  styleUrl: './drcr.scss'
})
export class Drcr {
  entryForm: FormGroup;
  // drcr: 'credit' | 'debit' = 'debit'; 
  crvalue: null | number = null;
  drvalue: null | number = 0;
  get entries(): FormArray {
    return this.entryForm.get('entries') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    this.entryForm = this.fb.group({
      entries: this.fb.array([])  // start with empty array
    });
    this.addEntry('debit');
  }

  ngAfterViewInit() {
   this.focusInput();
  }

  @ViewChild('account') inputEl!: ElementRef<HTMLInputElement>;

   focusInput() {
    this.inputEl.nativeElement.focus();
  }

  toggleField(entryIndex: number, type: 'debit' | 'credit') {
    const entry = this.entries.at(entryIndex);

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
    // let trdrdisable: boolean = false;

    const item = this.fb.group({
      id: [this.generateId()],
      party: ['', [Validators.required]],
      debit: [{ value: enable === 'debit' ? prefill ?? '' : '', disabled: enable !== 'debit' },
      enable === 'debit' ? Validators.required : []],
      credit: [{ value: enable === 'credit' ? prefill ?? '' : '', disabled: enable !== 'credit' },
      enable === 'credit' ? Validators.required : []],
      trtype: new FormControl(trtype)
    });
    this.entries.push(item);
  }

 
  // Remove field
  removeEntry(id: string) {
    const index = this.entries.controls.findIndex(ctrl => ctrl.get('id')?.value === id);
    if (index !== -1) {
      this.entries.removeAt(index);
    }
  }


  @Input() data = '';  // parent → child
  @Output() notify = new EventEmitter<string>(); // child → parent

  sendBack() {
    this.notify.emit(`Child says hello at ${new Date().toLocaleTimeString()}`);
    // this.drcrChange();
  }

  sayHello() {
    return "Hello from Dynamic Child!";
  }


  getTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    this.entries.controls.forEach(entry => {
      const d = Number(entry.get('debit')?.value || 0);
      const c = Number(entry.get('credit')?.value || 0);
      totalDebit += isNaN(d) ? 0 : d;
      totalCredit += isNaN(c) ? 0 : c;
    });

    return { totalDebit, totalCredit };
  }

  checkBalanceAndAdd() {
    const { totalDebit, totalCredit } = this.getTotals();

    // get last row values
    const lastEntry = this.entries.at(this.entries.length - 1);
    const lastDebit = parseFloat(lastEntry.get('debit')?.value);
    const lastCredit = parseFloat(lastEntry.get('credit')?.value);
    console.log('hi');

      
    // 🔒 do nothing if last entry is empty or 0
    if ((isNaN(lastDebit) || lastDebit <= 0) && (isNaN(lastCredit) || lastCredit <= 0)) {
      return;
    }

    // add balancing entry only when totals mismatch
    if (totalDebit > totalCredit) {
      const diff = totalDebit - totalCredit;
      if (diff > 0) this.addEntry('credit', diff);
    } else if (totalCredit > totalDebit) {
      const diff = totalCredit - totalDebit;
      if (diff > 0) this.addEntry('debit', diff);
    }
  }


  submit() {
    const { totalDebit, totalCredit } = this.getTotals();

    if (totalDebit !== totalCredit) {
      console.log('Not balanced, fixing...');
      this.checkBalanceAndAdd();
      return;
    }

    if (this.entryForm.valid) {
      console.log('Form Value:', this.entryForm.value);
      console.log('Totals:', totalDebit, totalCredit);
    } else {
      console.log('Form Invalid');
    }
  }


}