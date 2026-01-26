import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Decorator {

  public toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}
  
}
