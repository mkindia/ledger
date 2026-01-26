import { AfterViewInit, Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TransationDataSource, TransationItem } from './transation-datasource';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Layout } from '../services/layout';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from '../services/http-service';
import { UserService } from '../services/user-service';

import { CompanyModel } from '../datamodels/datamodels';
import { Drcr } from '../component/drcr/drcr';
import { MatInput } from "@angular/material/input";


@Component({
  selector: 'app-transation',
  templateUrl: './transation.component.html',
  styleUrl: './transation.component.scss',
  imports: [MatGridListModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule]
})
export class TransationComponent  {
 
  constructor(public layout: Layout, private http: HttpService, public userService: UserService){
    // this.getCompany();
  }
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  childRef!: ComponentRef<Drcr>;
  childMessage = '';

  loadComponent() {
    this.container.clear();

    // if(this.childRef.instance.drcr == 'dr'){
    //   this.childRef.instance.transationFrom.value.trtype = 'cr';
    // }else{
    //   this.childRef.instance.transationFrom.value.trtype = 'dr';
    // }
    

    // Create dynamic component
    this.childRef = this.container.createComponent(Drcr);
    

    // ✅ Pass data to @Input
    this.childRef.setInput('data', 'Hello from Parent!');

    // ✅ Listen to @Output
    this.childRef.instance.notify.subscribe((msg: any) => {
      this.childMessage = msg;
    });
  }

  callChild() {
    if (this.childRef) {
      alert(this.childRef.instance.sayHello());  
    } else {
      alert('Child not loaded yet!');
    }
  }

 selected: number | null = null;
  companies: CompanyModel[] = [];

  ngOnInit() {
    // this.getCompany();
    // this.companies = this.userService.userCompanies();
    // this.selected = this.userService.selectedCompany().id ?? null;

    // console.log(this.selected);
    
  }

  
  getledger() {
    if(this.userService.selectedCompany().id != null){
    this.http.get('ledger/',{'company': this.userService.selectedCompany().id }).subscribe((values:any) => {
      this.companies = values;
      console.log(values);
    })
  }
  }

}
