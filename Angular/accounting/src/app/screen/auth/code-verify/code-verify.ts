import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../../services/http-service';
import { ResendCode } from '../resend-code/resend-code';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonSrvice } from '../../../services/commonService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-verify',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './code-verify.html',
  styleUrl: './code-verify.scss'
})
export class CodeVerify {

  http = inject(HttpService);
  link = inject(Router)
  readonly commonService = inject(CommonSrvice) 
  readonly dialogData = inject(MAT_DIALOG_DATA);
  readonly codeDialog = inject(MatDialogRef<CodeVerify>);

  codeForm = new FormGroup({
    code: new FormControl('',Validators.required)
  })

  ngOnInit(){
    this.codeDialog.disableClose = true;    
  }

  code(){
    this.http.post('user/verify/',{'email':this.dialogData.email, 'code': this.codeForm.value.code}).subscribe(()=>{
      this.commonService.snackBar('email Verify Success You Can Login Now','', 3000);     
      this.codeDialog.close();
       this.link.navigateByUrl('/');
    });   
  }
  exit(){this.codeDialog.close()}
}
