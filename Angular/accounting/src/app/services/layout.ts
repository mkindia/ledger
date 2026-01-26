import { Injectable, signal } from '@angular/core';
import { Directive, HostListener, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Layout {  
  totalCols = signal(12);
  totalFields = signal<totalFields>({fields: 4});
  breakPoints = signal({'XSmall':false, 'Small':false, 'Medium':false, 'Large':false,'XLarge':false, 'HandsetPortrait':false,'HandsetLandscape':false}) 
  colSpan = signal<col_row_SpanLayout>({colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4: 12, colspan_5: 12, colspan_6: 12,  rowspan_1:1})
  appLayOut = signal<appLayout>({
    XSmall:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    Small:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    HandsetPortrait:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    HandsetLandscape:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    Medium:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    Large:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
    XLarge:{colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5: 12, colspan_6: 12, rowspan_1:1},
  })

  gridLayout(){      
      if(this.breakPoints().XSmall){
      this.colSpan.set({
        colspan_1: this.appLayOut().XSmall?.colspan_1, 
        colspan_2: this.appLayOut().XSmall?.colspan_2, 
        colspan_3: this.appLayOut().XSmall?.colspan_3, 
        colspan_4: this.appLayOut().XSmall?.colspan_4,
        colspan_5: this.appLayOut().XSmall?.colspan_5,
        colspan_6: this.appLayOut().XSmall?.colspan_6,
        rowspan_1: this.appLayOut().XSmall?.rowspan_1
      })
      }
      else if(this.breakPoints().Small){
      this.colSpan.set({
        colspan_1: this.appLayOut().Small?.colspan_1, 
        colspan_2: this.appLayOut().Small?.colspan_2, 
        colspan_3: this.appLayOut().Small?.colspan_3, 
        colspan_4: this.appLayOut().Small?.colspan_4,
        colspan_5: this.appLayOut().Small?.colspan_5,
        colspan_6: this.appLayOut().Small?.colspan_6,
        rowspan_1: this.appLayOut().Small?.rowspan_1})
      }
      else if(this.breakPoints().Medium){
      this.colSpan.set({
        colspan_1: this.appLayOut().Medium?.colspan_1, 
        colspan_2: this.appLayOut().Medium?.colspan_2, 
        colspan_3: this.appLayOut().Medium?.colspan_3, 
        colspan_4: this.appLayOut().Medium?.colspan_4,
        colspan_5: this.appLayOut().Medium?.colspan_5,
        colspan_6: this.appLayOut().Medium?.colspan_6, 
        rowspan_1: this.appLayOut().Medium?.rowspan_1})
      }
      else if(this.breakPoints().HandsetPortrait){
      this.colSpan.set({
        colspan_1: this.appLayOut().HandsetPortrait?.colspan_1, 
        colspan_2: this.appLayOut().HandsetPortrait?.colspan_2, 
        colspan_3: this.appLayOut().HandsetPortrait?.colspan_3, 
        colspan_4: this.appLayOut().HandsetPortrait?.colspan_4,
        colspan_5: this.appLayOut().HandsetPortrait?.colspan_5,
        colspan_6: this.appLayOut().HandsetPortrait?.colspan_6,
        rowspan_1: this.appLayOut().HandsetPortrait?.rowspan_1})
      }
      else if(this.breakPoints().HandsetLandscape){
      this.colSpan.set({
        colspan_1: this.appLayOut().HandsetLandscape?.colspan_1, 
        colspan_2: this.appLayOut().HandsetLandscape?.colspan_2,        
        colspan_3: this.appLayOut().HandsetLandscape?.colspan_3, 
        colspan_4: this.appLayOut().HandsetLandscape?.colspan_4,
        colspan_5: this.appLayOut().HandsetLandscape?.colspan_5,
        colspan_6: this.appLayOut().HandsetLandscape?.colspan_6,
        rowspan_1: this.appLayOut().HandsetLandscape?.rowspan_1})
      }
      else if(this.breakPoints().Large){
      this.colSpan.set({
        colspan_1: this.appLayOut().Large?.colspan_1, 
        colspan_2: this.appLayOut().Large?.colspan_2, 
        colspan_3: this.appLayOut().Large?.colspan_3, 
        colspan_4: this.appLayOut().Large?.colspan_4,
        colspan_5: this.appLayOut().Large?.colspan_5,
        colspan_6: this.appLayOut().Large?.colspan_6,
        rowspan_1: this.appLayOut().Large?.rowspan_1})
      }
      else if(this.breakPoints().XLarge){
      this.colSpan.set({
        colspan_1: this.appLayOut().XLarge?.colspan_1, 
        colspan_2: this.appLayOut().XLarge?.colspan_2, 
        colspan_3: this.appLayOut().XLarge?.colspan_3, 
        colspan_4: this.appLayOut().XLarge?.colspan_4,
        colspan_5: this.appLayOut().XLarge?.colspan_5,
        colspan_6: this.appLayOut().XLarge?.colspan_6,
        rowspan_1: this.appLayOut().XLarge?.rowspan_1})
      }
      else{
        this.colSpan.set({colspan_1: 12, colspan_2: 12, colspan_3: 12, colspan_4:12, colspan_5:12, colspan_6: 12, rowspan_1:1})
      }
  }

}

type max_col =  1 | 2 | 3 | 4 | 5 | 6 ;
type max_colspan = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 ;
type max_rowspan = 1 | 2 |3 | 4 | 5 | 6 ;

export interface col_row_SpanLayout {  
  colspan_1?: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
}

export interface totalFields{
  fields: max_col
}

export interface appLayout {
  XSmall?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  Small?:{
  colspan_1?: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  HandsetPortrait?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  HandsetLandscape?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  Medium?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  Large?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  XLarge?:{
  colspan_1: max_colspan,
  colspan_2?: max_colspan,
  colspan_3?: max_colspan,
  colspan_4?: max_colspan,
  colspan_5?: max_colspan,
  colspan_6?: max_colspan,
  rowspan_1?: max_rowspan,
  rowspan_2?: max_rowspan,
  rowspan_3?: max_rowspan,
  rowspan_4?: max_rowspan
  },
  
}


@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = this.el.nativeElement.value;
    this.el.nativeElement.value = value
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
