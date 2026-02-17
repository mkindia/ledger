import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { Layout } from './core/services/layout';
import { MatDialog } from '@angular/material/dialog';
import { Signin } from './screen/auth/signin/signin';
import { UserService } from './core/services/user-service';
import { CommonSrvice } from './core/services/commonService';
import { MatSelectModule } from '@angular/material/select';
import { SelectCompany } from './screen/company/select-company/select-company';
import {MatExpansionModule} from '@angular/material/expansion';
import { ListOfLedger } from './component/list-of-ledger/list-of-ledger';
import { KeyboardNavDirective } from "./core/directives/keyboard-nav.directive";
import { VoucherDialog } from './component/voucher/voucher-dialog/voucher-dialog';
import { HttpService } from './core/services/http-service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatSidenavModule,
    MatListModule, MatIconModule, AsyncPipe, MatSelectModule, TitleCasePipe, MatExpansionModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit {
  constructor(private layout: Layout, public userSrvice: UserService,
    public commonService: CommonSrvice, private router: Router) {
      this.userSrvice.getUserCompany();
    }

  selectedTheme: 'light' | 'dark' | 'system' = 'system';
  logedIn = signal<boolean>(false);
  // companies: CompanyModel[] = this.userSrvice.userCompanies();

  protected onThemeChange(theme: 'light' | 'dark' | 'system') {
    this.commonService.setTheme(theme);
  }

  http1 = inject(HttpService)
 
  ngOnInit() {
    if (this.userSrvice.getToken('access_token')) {
      this.logedIn.set(true);
      
      this.commonService.setTheme('system');
    }else{
      this.userSrvice.logout();
      this.router.navigateByUrl("/");
    }

  //  console.log('loged out');
    
  }

  ngAfterViewInit(): void {
    this.commonService.setTheme('system');
    setTimeout(() => {
      this.userSrvice.getSelectedCompanyLedger();
    }, 200);
  }

  @ViewChild('drawer') drawer: any
  public activetedRoute = inject(ActivatedRoute)
  protected readonly title = signal('ledger'); 
  sideNav = signal(false);
  private breakpointObserver = inject(BreakpointObserver);
  isHandset = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge, Breakpoints.Handset])
    .pipe(
      map(result => {
        this.layout.breakPoints.set({
          'XSmall': result.breakpoints[Breakpoints.XSmall],
          'Small': result.breakpoints[Breakpoints.Small],
          'Medium': result.breakpoints[Breakpoints.Medium],
          'Large': result.breakpoints[Breakpoints.Large],
          'XLarge': result.breakpoints[Breakpoints.XLarge],
          'HandsetPortrait': result.breakpoints[Breakpoints.HandsetPortrait],
          'HandsetLandscape': result.breakpoints[Breakpoints.HandsetLandscape]
        });

        this.layout.gridLayout();
        if (result.breakpoints[Breakpoints.HandsetPortrait] || result.breakpoints[Breakpoints.HandsetLandscape]) {
          this.sideNav.set(true);
          return true;
        }
        else {
          this.sideNav.set(false);
          return false;
        }

      }),
      shareReplay()
    );

  readonly dialog = inject(MatDialog);
  openDialog(): void {
    const signInDialog = this.dialog.open(Signin);
    signInDialog.afterClosed().subscribe(value => {
      if (value.access != undefined && value.refresh != undefined) {
        this.logedIn.set(true);
        this.userSrvice.getUserCompany();        
      }
    });
  }

 
  // selectCompany() {
  //   this.dialog.open(SelectCompany);
  // }

  // ledgerDialog(){
  //   this.dialog.open(ListOfLedger,{position: { top: '70px' }, });
  // }

  openDialogs(dialog: string): void {
    if(dialog == 'journal' ){
      this.dialog.open(VoucherDialog,{position: { top: '70px' }, minWidth:350 });
    }
    if(dialog == 'account' ){
      this.dialog.open(ListOfLedger,{position: { top: '70px' }, minWidth:350 });
    }
    if(dialog == 'company' ){
      this.dialog.open(SelectCompany,{position: { top: '70px' }, minWidth:350 });
    }
  }

  isActiveUrl(path: string): boolean {
    return this.router.url === path;
  }

  logoutProcess() {
    this.userSrvice.logout();
    window.location.replace('/');
  }

  SidenavClose() {
    if (this.sideNav() == true) { this.drawer.toggle(); }
  }



  menu =[
    {
      id:1,
      title:'Company',
      content:'company content',
      children:[
        {
          id:11,
          title:'Company',
          content:'company content',
        },
         {
          id:12,
          title:'Company',
          content:'company content',
        },
      ]
    }
  ]
}
