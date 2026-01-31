import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CompanyModel, ledger, userAccessTokenDecode } from '../datamodels/datamodels';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from './http-service';
import { routes } from '../app.routes';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private memoryStore = new Map<string, string>();
  constructor(private http: HttpService, @Inject(PLATFORM_ID) private platformId: Object) { }  
  userCompanies = signal<CompanyModel[]>([]);
  selectedCompany = signal<CompanyModel>({});
  selectedCompanyLedgerList = signal<ledger[]>([]);

  getUser(): userAccessTokenDecode {
    let user: userAccessTokenDecode;
    const decodeCode = this.getToken('access_token');
    if (decodeCode) {
      user = jwtDecode(decodeCode);
      return user
    } else {
      return {}
    }

  }

 

  getToken(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    else {
      return this.memoryStore.get(key) ?? null;
    }
  }

  setRefreshToken(refresh: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('refresh_token', refresh);
    } else {
      this.memoryStore.set('refresh_token', refresh);
    }
  }

  setAccessToken(access: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', access);
    } else {
      this.memoryStore.set('access_token', access);
    }
  }

  refreshToken(): Observable<string> {
    const refresh = this.getToken('refresh_token');
    
    if (!refresh) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<{ access: string }>(`refresh/`,
      { refresh }
    ).pipe(
      tap(response => {
        // localStorage.setItem('access_token', response.access);
        this.setAccessToken(response.access);
      }),
      map(response => response.access),
      catchError(err => {
        // ❌ Refresh token invalid/expired
        this.logout();
        return throwError(() => new Error('Session Expired'));
      })
    );
  }


  login(data: {}) {
    return this.http.post(`signin/`, data)
  }

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // window.location.reload();
  }

  getUserCompany() {
    this.http.get<CompanyModel[]>('company/').subscribe((values: CompanyModel[]) => {
      this.userCompanies.set(values);
      // this.companies = values;      
      values.forEach(element => {
        if (element.is_selected) {
          // console.log(element);
          this.selectedCompany.set(element);
        }
        
      });
    })
  }

   getSelectedCompanyLedger() {
      // this.getUserCompany();
      if (this.selectedCompany().id != undefined) {
        this.http.get<ledger[]>('ledger/', { company: this.selectedCompany().id}).subscribe((value) => {
          this.selectedCompanyLedgerList.set(value);
        });
      }
    }


}
