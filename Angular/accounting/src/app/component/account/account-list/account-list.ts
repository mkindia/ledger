import { Component, inject, Input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ledger } from '../../../datamodels/datamodels';
import { TitleCasePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Decorator } from '../../../core/decorators/decorator';

@Component({
  selector: 'app-account-list',
  imports: [MatAutocompleteModule, MatOptionModule, 
    TitleCasePipe, MatFormFieldModule, 
    ReactiveFormsModule, MatInputModule],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss',
})
export class AccountList {

  decorator = inject(Decorator);

  @Input() options: ledger[] = [];
  accountControl = new FormControl();
  filteredLedger: ledger[] = [];
  selectedAccountValue = "";

  filter(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredLedger = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  displayUser = (account: ledger): string => {
    if (!account || !account.name) return '';
    return this.decorator.toTitleCase(account.name);
  }

}
