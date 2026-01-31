import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { TransationComponent } from './transation/transation.component';

import { UserRegistration } from './screen/auth/user-registration/user-registration';
import { Home } from './screen/home/home';
import { Signin } from './screen/auth/signin/signin';
import { matchGuard } from './match.guard';
import { Transation } from './screen/transation/transation';
import { Group } from './administration/masters/accounting/group/group';
import { Ledger } from './screen/ledger/ledger/ledger';
import { CompanyComponent } from './screen/company/company/company';
import { AccountLedger } from './screen/dispaly/account-ledger/account-ledger';
import { Entry } from './screen/entry/entry/entry';
import { AccountingTable } from './screen/transaction1/accounting-table';
import { VoucherDialog } from './component/voucher/voucher-dialog/voucher-dialog';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },   
    {
        path: 'das',
        component: DashboardComponent, canMatch: [matchGuard]
    },
    // {
    //     path: 'userRegistration',
    //     component: UserRegistration,
    // },
   
    {
        path: 'edit-receipt',
        component: Entry,
    },
    {
        path:'user',
        children:[
            {path:'registration',component:UserRegistration},
            {path:'login',component:Signin},
        ]
    },
    {
        path:'company',
        children:[
            {path:'create',component: CompanyComponent},            
        ]

    },
    {
        path:'master',
        children:[
            {
                path:'account',
                children:[
                    {path:'create', component: Ledger},
                    {path:'edit', component: Ledger},
                    {path:'list', component: Ledger}
                ]
            },
            {
                path:'account_group',
                children:[
                    {path:'create', component: Group},
                    {path:'edit', component: Group},
                    {path:'list', component: Group}
                ]
            },
        ]
    },
    {
        path: 'transaction',
        
        children: [
            {
                path:':id',component:Transation
            },      
            {
                path: 'sale',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
            {
                path: 'purchase',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
            {
                path: 'receipt',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
            {
                path: 'payment',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
            {
                path: 'journal',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
            {
                path: 'contra',
                children: [
                    { path: 'create', component: Transation, },
                    { path: 'Edit', component: Transation, },
                    { path: 'List', component: Transation, }
                ]
            },
        ]
    },
//    {
//         path:'transaction/:id', component:Transation
//    },
    {
        path: 'ledger/:id',
        component: AccountLedger,
    },
    
    { path: '**', component: Home }



];
