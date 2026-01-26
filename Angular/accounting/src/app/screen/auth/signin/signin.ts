import { Component, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user-service';
import { CommonSrvice } from '../../../services/commonService';
import { jwtDecode } from 'jwt-decode';
import { userAccessTokenDecode } from '../../../datamodels/datamodels';
import { KeyboardNavDirective } from "../../../core/directives/keyboard-nav.directive";
// import { EventEmitter } from 'node:stream';
// import { access } from 'node:fs';

@Component({
  selector: 'app-signin',
  imports: [MatDialogModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, KeyboardNavDirective],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
 
})
export class Signin {
 dd:any
// @Output() appData = new EventEmitter();
 readonly dialogRef = inject(MatDialogRef<Signin>);

  constructor(private userService: UserService, private snackBar: CommonSrvice) {    
   this.dialogRef.disableClose = true; //for disable close dialog outside click
  }


  // hide = signal(true);
  
  // clickEvent(event: MouseEvent) {
  //   this.hide.set(!this.hide());
  //   event.stopPropagation();
  // }
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required,]),
  });

  loginProcess(formValue: any) {    
   let username = formValue.username.toLowerCase();
    this.userService.login({"username":username,"password":formValue.password}).subscribe(
      (res:any)=>{        
        this.dialogRef.close({access: res.access, refresh:res.refresh});
        this.userService.setAccessToken(res.access);
        this.userService.setRefreshToken(res.refresh);  
        setTimeout(() => {
          // window.location.replace('/');
        },300);
        // this.appData.emit('hello')
                
      })

      // console.log(formValue);
      
  }
    
  exit(){  
    this.dialogRef.close({access: undefined, refresh: undefined});
    // this.userService.loginStatus.set(false);
    // window.location.replace("/")
  }


}


