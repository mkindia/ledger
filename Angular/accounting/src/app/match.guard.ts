import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';


export const matchGuard: CanMatchFn = (route, segments) => {
    
  const router = inject(Router);
    
  let is_active = false;
  let match = route.path
  if(match != undefined){
  if (match.length > 0) {
    is_active = true;
  } else {
    router.navigateByUrl('/');
  }
}
  return is_active;
};
