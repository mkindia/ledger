import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ledger } from '../datamodels/datamodels';

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  constructor() { }
 
  groups = httpResource<ledger[]>(() => ({
    url: 'group.json'
  }))

}

