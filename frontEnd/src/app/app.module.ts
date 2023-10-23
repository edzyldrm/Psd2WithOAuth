// Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

// Services
import { AccountService } from './account.service';
import { CustomerService } from './customer.service';
import { TppService } from './tpp.service';
import { AuthorizationService } from './authorization.service';
import { PaymentService } from './payment.service';
import { MessageService } from './message.service';
import { InMemoryDataService } from './in-memory-data.service';

// Components
import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MessagesComponent } from './messages/messages.component';
import { ManageAccountsComponent } from './manage-accounts/manage-accounts.component';
import { CustomersComponent } from './customers/customers.component';
import { TppsComponent } from './tpps/tpps.component';
import { AuthorizationsComponent } from './authorizations/authorizations.component';
import { PaymentsComponent } from './payments/payments.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    MessagesComponent,
    ManageAccountsComponent,
    CustomersComponent,
    TppsComponent,
    AuthorizationsComponent,
    PaymentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
//    HttpClientInMemoryWebApiModule.forRoot(
//      InMemoryDataService, { dataEncapsulation: false }
//    )
  ],
  providers: [AccountService, CustomerService, TppService, AuthorizationService, PaymentService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
