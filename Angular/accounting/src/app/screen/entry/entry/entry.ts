import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface Entry {
  id: number;
  type: 'Debit' | 'Credit';
  account: string;
  amount: number;
  narration: string;
}


@Component({
  selector: 'app-entry',
  imports: [MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  ReactiveFormsModule, DecimalPipe],
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
})
export class Entry {

  displayedColumns = ['type', 'account', 'amount', 'narration', 'actions'];
  dataSource = new MatTableDataSource<Entry>([]);
  entryForm: FormGroup;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.entryForm = this.fb.group({
      type: ['', Validators.required],
      account: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      narration: ['']
    });
  }

  addOrUpdate() {
    if (this.entryForm.invalid) return;

    if (this.editIndex !== null) {
      this.dataSource.data[this.editIndex] = {
        ...this.dataSource.data[this.editIndex],
        ...this.entryForm.value
      };
      this.editIndex = null;
    } else {
      this.dataSource.data = [
        ...this.dataSource.data,
        { id: Date.now(), ...this.entryForm.value }
      ];
    }

    this.dataSource._updateChangeSubscription();
    this.entryForm.reset();
  }

  edit(row: Entry, index: number) {
    this.editIndex = index;
    this.entryForm.patchValue(row);
  }

  delete(index: number) {
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  get totalDebit() {
    return this.dataSource.data
      .filter(e => e.type === 'Debit')
      .reduce((a, b) => a + b.amount, 0);
  }

  get totalCredit() {
    return this.dataSource.data
      .filter(e => e.type === 'Credit')
      .reduce((a, b) => a + b.amount, 0);
  }

}
