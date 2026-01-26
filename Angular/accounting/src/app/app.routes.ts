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

export const routes: Routes = [
    {path:'',
        component: Home,
    },     
    {path:'company',
        component: CompanyComponent,
    },
    {path:'das',
        component: DashboardComponent, canMatch:[matchGuard]
    },
    {path:'userRegistration',
        component: UserRegistration,
    },
    {path:'sale',
        component: AccountingTable,
    },
    {path:'purchase',
        component: Transation,
    },
    {path:'payment',
        component: Transation,
    },
    {path:'receipt',
        component: Transation,
    },
    {path:'edit-receipt',
        component: Entry,
    },
    {path:'journal',
        component: Transation, canMatch:[matchGuard]
    },
    {path:'contra',
        component: Transation,
    },
    {path:'login',
        component: Signin,
    },
    {path:'create_group',
        component: Group,
    },
    {path:'create_client',     
        component: Ledger,
    },
    {path:'ledger/:id',     
        component: AccountLedger,
    },
    {
        path : 'transaction/:id',
        component: Transation,
    //     children: [ // <-- Nested routes are defined here
    //         { path: 'edit_payment', component: Transation },// URL: /parent/child-a
           
    // ]
    },
    {path:'**',component: Home}

    

];
