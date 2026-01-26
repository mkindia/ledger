import { Directive, HostListener } from "@angular/core";

@Directive({
    selector:'[appKeyboardNav]'
})
export class KeyboardNavDirective{
    @HostListener('click', ['$event'])
    handleClick(event:MouseEvent){
        console.log('mouse interaction:', event.target);
        
    }
}