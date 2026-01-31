import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface AccountingEntry {
  id: number;
  type: 'Dr' | 'Cr';
  account: string;
  amount: number;
  narration: string;
}

@Component({
  selector: 'app-accounting-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './accounting-table.html',
  styleUrls: ['./accounting-table.scss']
})
export class AccountingTable {
  displayedColumns: string[] = ['type', 'account', 'amount', 'narration', 'actions'];
  dataSource: AccountingEntry[] = [
    { id: 1, type: 'Dr', account: 'Cash', amount: 1000, narration: 'Opening balance' },
    { id: 2, type: 'Cr', account: 'Capital', amount: 1000, narration: 'Opening balance' }
  ];
  
  accountTypes: string[] = ['Dr', 'Cr'];
  nextId = 3;

  addRow(): void {
    const newEntry: AccountingEntry = {
      id: this.nextId++,
      type: 'Dr',
      account: '',
      amount: 0,
      narration: ''
    };
    this.dataSource = [...this.dataSource, newEntry];
  }

  deleteRow(id: number): void {
    this.dataSource = this.dataSource.filter(entry => entry.id !== id);
  }

  getTotalDebit(): number {
    return this.dataSource
      .filter(entry => entry.type === 'Dr')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  }

  getTotalCredit(): number {
    return this.dataSource
      .filter(entry => entry.type === 'Cr')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  }

  getDifference(): number {
    return this.getTotalDebit() - this.getTotalCredit();
  }

  isBalanced(): boolean {
    return Math.abs(this.getDifference()) < 0.01;
  }

  onSubmit(): void {
    if (this.isBalanced()) {
      console.log('Journal Entry Data:', this.dataSource);
      alert('Journal entry is balanced and submitted!');
    } else {
      alert('Journal entry is not balanced! Please check your entries.');
    }
  }

  clearAll(): void {
    this.dataSource = [];
    this.nextId = 1;
  }
}
