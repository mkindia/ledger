import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Layout } from '../../../../core/services/layout';
import { Focus } from '../../../../core/services/focus';
import { ledger } from '../../../../datamodels/datamodels';
import { UserService } from '../../../../core/services/user-service';
import { CommonSrvice } from '../../../../core/services/commonService';
import { HttpService } from '../../../../core/services/http-service';
@Component({
  selector: 'app-group',
  imports: [MatCardModule, MatGridListModule, ReactiveFormsModule, MatButtonModule,
    MatLabel, MatInputModule, MatCheckboxModule, MatSelectModule, TitleCasePipe, MatIcon],
  templateUrl: './group.html',
  styleUrl: './group.scss'
})
export class Group {

  constructor(public layout: Layout, public userService: UserService, 
    public focus: Focus, private http:HttpService, private commonService: CommonSrvice){

    layout.appLayOut.set({ 
      XSmall: { colspan_1: 6, colspan_2: 6, colspan_3:4, colspan_4:8, colspan_5:1, colspan_6:0, rowspan_1:3}, 
      Small: { colspan_1: 6, colspan_2: 6, colspan_3: 4, colspan_4:8, colspan_5:1, colspan_6:0, rowspan_1:3},
      HandsetPortrait: {colspan_1: 4, colspan_2: 4, colspan_3: 4, colspan_4:2, colspan_5:1, colspan_6:0, rowspan_1:1},
      HandsetLandscape: {colspan_1: 4, colspan_2:6, colspan_3:4, colspan_4:2, colspan_5:1, colspan_6:0, rowspan_1:1},
      Medium:{colspan_1: 4, colspan_2: 3, colspan_3: 2, colspan_4:3, colspan_5:1, colspan_6:0, rowspan_1:2},
      Large:{colspan_1: 4, colspan_2: 3, colspan_3: 2, colspan_4:3, colspan_5:0, colspan_6:1, rowspan_1:1},
      XLarge:{colspan_1: 1, colspan_2: 3, colspan_3: 3, colspan_4:4, colspan_5:0, colspan_6:1, rowspan_1:1} 
    })
      layout.gridLayout();
      userService.getUserCompany();
      this.getLedger();
    
  }


  group_type = 'under group';
    
  groupForm = new FormGroup ({
    name : new FormControl<string>('', Validators['required']),
    is_primary : new FormControl<boolean>(false, Validators['required']),
    under : new FormControl<string>('', Validators['required'])
  })

  groupSelect(value:boolean){
    if(value){
      this.group_type = 'nature of group';     
    }else{
      this.group_type = 'under group';      
    }
    
  }

  allLedger:ledger[]=[];

   getLedger(){ 
    if(this.userService.selectedCompany()?.id != undefined){
      this.http.get<ledger[]>('ledger/',{company:this.userService.selectedCompany()?.id}).subscribe((value)=>{
        console.log(value);   
        this.allLedger = value;   
      })
    }
    }


    subbmit(value: any) {
    // console.log(value);
    let selected_company = this.userService.selectedCompany()?.id;
    let ledger = {
      company: selected_company,
      ledger_type: 1,
      name: value.name,
      under: value.under.id,
      code: value.under.code
    }
    // console.log(ledger);
    this.http.post<ledger>('ledger/', ledger).subscribe((data) => {
      this.getLedger();
      this.commonService.snackBar('Group Created' +'( ' +data.name+' )', '', 4000);
      console.log(data)
    });

    // console.log(value);

  }
}
