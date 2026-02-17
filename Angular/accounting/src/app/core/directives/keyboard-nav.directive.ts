import { Directive, HostListener } from "@angular/core";

@Directive({
    selector:'[appKeyboardNav]'
})
export class KeyboardNavDirective{
    @HostListener('window:keydown', ['$event'])
    handleKeydown(event: KeyboardEvent){
        const target = event.target;

        if(!(target instanceof HTMLElement)) return;

        switch(event.key){
            case 'Enter':
            case ' ':
                target.click();
                event.preventDefault();                              
                break;

            case 'ArrowDown':
                (target.nextElementSibling as HTMLElement | null)?.focus();
                event.preventDefault();
                break; 

            case 'ArrowUp':
                (target.previousElementSibling as HTMLElement | null)?.focus();
                event.preventDefault();
                break;

            case 'Home':
                let first = target.parentElement?.firstElementChild as HTMLElement | null;
                first?.focus();                
                event.preventDefault();
                break; 
            
            case 'End':
                let last = target.parentElement?.lastElementChild as HTMLElement | null;
                last?.focus();                
                event.preventDefault();
                break;

            case 'Escape':
                (target.closest('.mat-dialog-container') as HTMLElement | null)?.querySelector('.mat-dialog-close')?.dispatchEvent(new Event('click'));
                                
                event.preventDefault();
                break;    
        }
       
    }
}