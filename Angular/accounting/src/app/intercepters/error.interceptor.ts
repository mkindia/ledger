import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { CommonSrvice } from '../services/commonService';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    let commonService = inject(CommonSrvice);
    return next(req).pipe(
        catchError((err) => {
            let error_Name = '';
            for (let er in err.error) {
                error_Name = err.error[er]
            }
            if (error_Name != '') {
                commonService.snackBar(`${error_Name}`, 'Dismiss', 5000);
            }
            else if(err.status === 401){
                
            }
            else {
                if (err.status == 0) {
                    commonService.snackBar(`Somthing Went Wrong`, 'Dismiss', 5000);
                } else {
                    commonService.snackBar(`${err.error}`, 'Dismiss', 5000);
                }
            }
            
            return throwError(() => new Error('Intercepted Error: ' + error_Name));
        })

    );
};
