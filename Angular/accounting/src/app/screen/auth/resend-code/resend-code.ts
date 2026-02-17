import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CodeVerify } from '../code-verify/code-verify';

import { CommonSrvice } from '../../../core/services/commonService';
import { HttpService } from '../../../core/services/http-service';

@Component({
  selector: 'app-resend-code',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './resend-code.html',
  styleUrl: './resend-code.scss'
})
export class ResendCode {

  http = inject(HttpService)
  commonService = inject(CommonSrvice)

   readonly resendDialog = inject(MatDialogRef<ResendCode>)
   
   readonly verifyCodeDialog = inject(MatDialog);
  resendCodeForm = new FormGroup({
    email : new FormControl('',Validators.required)
  })
  ngOnInit(){
    this.resendDialog.disableClose = true;
  }

  exit(){
    this.resendDialog.close(ResendCode);
  }

  resendCode(){
      this.http.post("user/resend_code/",{email:this.resendCodeForm.value.email}).subscribe(
        (result:any)=>{          
          this.commonService.snackBar(result.message,'',3000);
          this.verifyCodeDialog.open(CodeVerify,{data: {email:this.resendCodeForm.value.email}});
          this.resendDialog.close(ResendCode);               
      })
           
  }


}
