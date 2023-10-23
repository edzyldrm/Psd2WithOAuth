import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { CustomersComponent } from './customers/customers.component';
import { TppsComponent } from './tpps/tpps.component';
import { AuthorizationsComponent } from './authorizations/authorizations.component';
import { PaymentsComponent } from './payments/payments.component';
import { ManageAccountsComponent } from './manage-accounts/manage-accounts.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: 'accounts', component: AccountsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'tpps', component: TppsComponent },
  { path: 'authorizations', component: AuthorizationsComponent },
  { path: 'payments', component: PaymentsComponent },  
  { path: 'mngAccounts', component: ManageAccountsComponent },
  { path: '', redirectTo: '/accounts', pathMatch: 'full' }];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
