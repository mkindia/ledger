import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../core/services/user-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { CommonSrvice } from '../core/services/commonService';
import { environment } from '../../environments/environment.development';
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  let userService = inject(UserService);
  let commonService = inject(CommonSrvice);

  const accessToken = userService.getToken('access_token');
  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes(`${environment.baseUrl}refresh/`)) {
        return userService.refreshToken().pipe(
          switchMap((newToken: string) => {
            // Retry request with new token
            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(newReq);
          }),
          catchError(err => {            
            if (err == 'Error: Session Expired') {
              commonService.snackBar('Session Expired', '', 2000);
              userService.logout();
              setTimeout(() => {
               window.location.replace('/');
              }, 2000);
              
            } else if(err == 'Error: No refresh token available' ) {
              commonService.snackBar('user or password incorrect', '', 3000);              
            }
            else{
            // commonService.snackBar('token refreshed', '', 500);
            // return throwError(()=> new Error("Token Expired"))
            }              
            return throwError(() => err);           
          })
        );
      }
      else {        
        let error_name = undefined;
        for (let err in error.error) {
          if (error.error[err]) {
            // console.log(error.error[err]);
            error_name = error.error[err][0];
          }
        }
        if (error_name != undefined) {          
            commonService.snackBar(error_name, 'Ok', 4000);             
        }
        else { 
          if(error.error == 'TypeError: Failed to fetch'){
            commonService.snackBar('--- Some thing went wrong ---','OK');
            // userService.logout();            
          }else{
            commonService.snackBar(error.error, '', 4000) 
          }
          // commonService.snackBar(error.error, '',4000)
        }
      }
      return throwError(() => error);
    })
  );
};
