import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Layout } from '../services/layout';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../services/user-service';

import { HttpService } from '../services/http-service';
import { AsyncPipe } from '@angular/common';
import { CompanyModel } from '../datamodels/datamodels';
import { CommonSrvice } from '../services/commonService';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [   
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    // AsyncPipe
  ]
})
export class DashboardComponent {
  http1 = inject(HttpService)
  selectedCompany:CompanyModel={};
  constructor(public layout: Layout, private userService: UserService, private commonService: CommonSrvice) {    
    layout.appLayOut.set({ 
      XSmall: { colspan_1: 12, colspan_2: 12, colspan_3:12 }, 
      Small: { colspan_1: 12, colspan_2: 12, colspan_3: 12 },
      HandsetPortrait: {colspan_1: 4, colspan_2:4, colspan_3:12},
      HandsetLandscape: {colspan_1: 4, colspan_2:4, colspan_3:12},
      Medium:{colspan_1: 4, colspan_2: 4, colspan_3: 12},
      Large:{colspan_1: 6, colspan_2: 6, colspan_3: 6} })
      layout.gridLayout();
      // console.log(userService.isTokenExpired());
      this.selectedCompany = userService.selectedCompany();
    }
  
    ff = this.http1.getResource<ff[]>('user/')
    ngOnInit(){
     
    }
    
}

export interface ff {
  username:string,
  first_name:string,
  last_name:string,
  email:string
}