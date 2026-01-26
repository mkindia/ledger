import { Component } from '@angular/core';
import { userAccessTokenDecode } from '../../../datamodels/datamodels';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Layout } from '../../../services/layout';
import { MatGridListModule } from "@angular/material/grid-list";
import { UserService } from '../../../services/user-service';
import { HttpService } from '../../../services/http-service';
import { jwtDecode } from 'jwt-decode';
import { MatIcon } from '@angular/material/icon';
import { CommonSrvice } from '../../../services/commonService';
import { Router } from '@angular/router';


// import { CompanyService } from '../../../services/companyservice';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatIcon ,MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatGridListModule, MatIcon,],
  templateUrl: './company.html',
  styleUrl: './company.scss'
})
export class CompanyComponent{

  
  constructor(public layout: Layout, private http: HttpService, private router: Router,
    private userService: UserService, public commonService: CommonSrvice){   
    layout.appLayOut.set({ 
      XSmall: { colspan_1: 12, colspan_2: 12, colspan_3:12 }, 
      Small: { colspan_1: 12, colspan_2: 12, colspan_3: 12 },
      HandsetPortrait: {colspan_1: 4, colspan_2:3, colspan_3:12},
      HandsetLandscape: {colspan_1: 4, colspan_2:4, colspan_3:12},
      Medium:{colspan_1: 4, colspan_2: 4, colspan_3: 12},
      Large:{colspan_1: 6, colspan_2: 6, colspan_3: 6} })
      layout.gridLayout();      
      // console.log(userService.getToken('token'));
     this.Token = userService.getToken('access_token');     
  }
  
  Token :any;

  ngOnInit(){
    
  }
  
  companyForm = new FormGroup({
    company_name: new FormControl('', [Validators.required]),
    alies: new FormControl('', [Validators.required]),
    print_name: new FormControl('', [Validators.required]),
  }
  )

 

  submit(formValue:any){
    const decodeToken:userAccessTokenDecode = jwtDecode(this.Token);

    if(this.userService.getToken('access_token')!= null){
    
    }
    
          
    const company:company = {
    user_account: decodeToken.user_id,
    company_name :formValue.company_name,
    alies:formValue.alies,
    print_name: formValue.print_name,
    is_selected: true,
   }
  //  console.log(company);    
    this.http.post<company>("company/",company).subscribe((value)=>{
      this.userService.getUserCompany();
      this.commonService.snackBar(`Company Creaded Success ${value.company_name}`,'',3000);
      this.router.navigate(["/"]);
    })    
  }

}

interface company {
    "user_account": number | undefined,
    "company_name": string,
    "alies" ?: string,
    "print_name": string,
    "is_selected": boolean
}
