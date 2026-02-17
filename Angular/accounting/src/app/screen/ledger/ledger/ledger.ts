import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Layout } from '../../../core/services/layout';
import { Focus } from '../../../core/services/focus';
import { TitleCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { StaticService } from '../../../core/services/staticservice';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { UserService } from '../../../core/services/user-service';
import { CommonSrvice } from '../../../core/services/commonService';
import { ledger } from '../../../datamodels/datamodels';
import { HttpService } from '../../../core/services/http-service';

@Component({
  selector: 'app-ledger',
  imports: [MatCardModule, MatGridListModule, MatFormFieldModule,
    MatIcon, MatInputModule, MatButtonModule, MatSelectModule, TitleCasePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './ledger.html',
  styleUrl: './ledger.scss'
})
export class Ledger {
  constructor(public layout: Layout, public focus: Focus,
    public staticservice: StaticService, private commonService: CommonSrvice,
    private http: HttpService, public userService: UserService) {
    layout.appLayOut.set({
      XSmall: { colspan_1: 12, colspan_2: 12, colspan_3: 6, colspan_4: 6, colspan_5: 1, colspan_6: 0, rowspan_1: 3 },
      Small: { colspan_1: 12, colspan_2: 12, colspan_3: 6, colspan_4: 6, colspan_5: 1, colspan_6: 0, rowspan_1: 3 },
      HandsetPortrait: { colspan_1: 4, colspan_2: 4, colspan_3: 4, colspan_4: 2, colspan_5: 1, colspan_6: 0, rowspan_1: 1 },
      HandsetLandscape: { colspan_1: 4, colspan_2: 6, colspan_3: 4, colspan_4: 2, colspan_5: 1, colspan_6: 0, rowspan_1: 1 },
      Medium: { colspan_1: 6, colspan_2: 6, colspan_3: 4, colspan_4: 4, colspan_5: 3, colspan_6: 0, rowspan_1: 2 },
      Large: { colspan_1: 6, colspan_2: 6, colspan_3: 4, colspan_4: 4, colspan_5: 3, colspan_6: 1, rowspan_1: 1 },
      XLarge: { colspan_1: 6, colspan_2: 6, colspan_3: 3, colspan_4: 4, colspan_5: 0, colspan_6: 1, rowspan_1: 1 }
    });
    layout.gridLayout();   
  }
  ledger_type = 'under group';
  ledgerForm = new FormGroup({
    ledger_name: new FormControl('', [Validators.required]),
    print_name: new FormControl('', [Validators.required]),
    short_name: new FormControl(''),
    under_ledger: new FormControl(''),
    state: new FormControl(''),
    phone: new FormControl('') 
  })


  subbmit(value: any) {
  //  console.log(value);   
    let ledger: ledger = {
      company: this.userService.selectedCompany()?.id!,
      ledger_type: 2,
      name: value.ledger_name,
      parent: value.under_ledger.id,
      code: value.under_ledger.code
    }

    // console.log(ledger);
    this.http.post<ledger>('ledger/', ledger).subscribe((data) => {
      this.userService.getSelectedCompanyLedger();
      this.ledgerForm.reset();
      this.commonService.snackBar(data.name, '', 4000);      
    }); 
  }


}
