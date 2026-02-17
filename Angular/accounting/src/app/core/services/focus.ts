import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Focus {

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
      )
    );
  }
  

  focusNext(current: HTMLElement) {
    const elements = this.getFocusableElements();
    const index = elements.indexOf(current);
    if (index > -1 && index < elements.length - 1) {
      elements[index + 1].focus();
    }
  }

  focusPrev(current: HTMLElement) {
    const elements = this.getFocusableElements();
    const index = elements.indexOf(current);
    if (index > 0) {
      elements[index - 1].focus();
    }
  }

  focusFirst() {
    const elements = this.getFocusableElements();
    if (elements.length) {
      elements[0].focus();
    }
  }

  focusLast() {
    const elements = this.getFocusableElements();
    if (elements.length) {
      elements[elements.length - 1].focus();
    }
  }


  // focus(event: any, elem: HTMLElement): void {
   
  //   console.log(event.key);
    
  //   if (event.key == 'Backspace') {      
  //       this.focusPrev(elem)     
  //   }
  //   if (event.key == 'Enter') {
  //     // nextElement?.focus();
  //     this.focusNext(elem)
  //   }
  //   }

    focus(event: any, previousElement?: HTMLInputElement | null, nextElement?: HTMLInputElement | null, value?: any): void {
    if (event.key == 'Backspace') {
      if (value == undefined || value == '') {
        previousElement?.focus();
      }
    }
    if (event.key == 'Enter') {
      nextElement?.focus();
    }
  }


  }



