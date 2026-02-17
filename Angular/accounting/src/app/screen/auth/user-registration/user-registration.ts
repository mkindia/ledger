import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonSrvice } from '../../../core/services/commonService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResendCode } from '../resend-code/resend-code';
import { CodeVerify } from '../code-verify/code-verify';
import { HttpService } from '../../../core/services/http-service';


@Component({
  selector: 'app-user-registration',
  imports: [ReactiveFormsModule, MatCardModule, MatFormField, MatButtonModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss'
})
export class UserRegistration {

  readonly dialog = inject(MatDialog);

  constructor(private http: HttpService, private commonService: CommonSrvice, private link: Router) { }

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(): void {
    if (this.registrationForm.valid) {

      
      // You can plug this into a service for backend submission
      this.http.post("user/", this.registrationForm.value).subscribe(
        (result: any) => {
          
          console.log(this.registrationForm.value.email);
          this.dialog.open(CodeVerify, { data: { email: this.registrationForm.value.email } });
          this.commonService.snackBar(`User Created Success ${result.email} Email send to your email Please veryfiy for login`, 'Ok', 3000)
          // this.link.navigateByUrl('/');
        })
    }

    // this.userOption = 'verifyuser';

  }

  reSendCode() {
    this.link.navigateByUrl('/');
    this.dialog.open(ResendCode, {
      // width: '380px',     
    });
  }

}
