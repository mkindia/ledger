import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, httpResource} from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  http = inject(HttpClient);
  
  getResource<T>(url: string, params?: Record<string, string | number>): any {
    return httpResource<T>(() => ({
      url: `${environment.apiUrl}${url}`,
      method: 'GET',
      params: params ? Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, v.toString()])
      ) : undefined,
      cache: 'no-cache'
    }));
  }



  get<T>(endPoint: string, params?: any){
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<T>(`${environment.apiUrl}${endPoint}`,{cache:'no-cache', params: httpParams})
  }


  
  post<T>(endPoint: string, body: any) {
    return this.http.post<T>(`${environment.apiUrl}${endPoint}`, body)
  }

  put<T>(endPoint: string, body: any) {
    return this.http.put<T>(`${environment.apiUrl}${endPoint}`, body)
  }

  patch<T>(endPoint: string, body: any) {
    return this.http.patch<T>(`${environment.apiUrl}${endPoint}`, body)
  }

  delete<T>(endPoint: string) {
    return this.http.delete<T>(`${environment.apiUrl}${endPoint}`)
  }

}
