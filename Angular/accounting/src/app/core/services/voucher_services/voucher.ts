import { inject, Injectable, signal } from '@angular/core';
import { VoucherType } from '../../../datamodels/datamodels';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root',
})
export class Voucher {

selectedVoucher_code = signal<VoucherType | null>(null);

http = inject(HttpService)

 getAllVoucherType(){
      return this.http.get<VoucherType[]>('voucher_type/');
    }


  
}
