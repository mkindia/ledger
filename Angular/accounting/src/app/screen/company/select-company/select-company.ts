import { Component, inject, viewChild, ViewChild, viewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { HttpService } from '../../../services/http-service';
import { CompanyModel } from '../../../datamodels/datamodels';
import { UserService } from '../../../services/user-service';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TitleCasePipe } from '@angular/common';
import { MatColumnDef } from "@angular/material/table";
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-company',
  imports: [MatDialogModule, MatSelectModule,
    MatButtonModule, MatIconModule,
    ReactiveFormsModule, TitleCasePipe],
  templateUrl: './select-company.html',
  styleUrl: './select-company.scss'
})
export class SelectCompany {
  readonly selectCompanyDialogref = inject(MatDialogRef<SelectCompany>);
  constructor(private http: HttpService, public userService: UserService, private route: Router) {
    this.selectCompanyDialogref.disableClose = true;
  }

  selected: number | null = null;
  companies: CompanyModel[] = [];

  ngOnInit() {
    // this.getCompany();
    this.companies = this.userService.userCompanies();
    this.selected = this.userService.selectedCompany().id ?? null;
  }

  
  getCompany() {
    this.http.get<CompanyModel[]>('company/').subscribe((values: CompanyModel[]) => {
      this.companies = values;
      console.log(values);
    })
  }

  setCompany(selectedCompany: number) {
    this.http.patch<SelectCompany>(`company/${selectedCompany}/`, {'is_selected': true}).subscribe((value:SelectCompany)=>{      
      this.userService.getUserCompany();
      this.route.navigate(["/"]);
      this.selectCompanyDialogref.close();
    })
  }



}
