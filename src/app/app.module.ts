import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {router} from './router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {MapComponent} from './component/user/map/map.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {AdminComponent} from "./component/admin/admin.component";
import {SignUpComponent} from "./component/user/auth/sign-up/sign-up.component";
import {NavBarComponent} from "./component/user/nav-bar/nav-bar.component";
import {GeneralComponent} from "./component/general/general.component";
import {UserComponent} from "./component/user/user.component";
import {AuthComponent} from "./component/user/auth/auth.component";
import {SignInComponent} from "./component/user/auth/sign-in/sign-in.component";
import {SubmitEmailComponent} from "./component/user/auth/submit-email/submit-email.component";
import {HomeComponent} from "./component/user/nav-bar/add-cafe/main-modal/home.component";
import {SelectorComponent} from "./component/user/nav-bar/add-cafe/selector/selector.component";
import {MapModalComponent} from "./component/user/nav-bar/add-cafe/map/map-modal.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {ModalModule} from "./component/user/nav-bar/add-cafe/_modal/modal.module";
import {RouterModule} from "@angular/router";
import {router} from "./router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {InterceptorService} from "./service/interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    GeneralComponent,
    SignUpComponent,
    NavBarComponent,
    AuthComponent,
    SignInComponent,
    SubmitEmailComponent,
    MapComponent,
    HomeComponent,
    SelectorComponent,
    MapModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(router),
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyB58CWxV1yNQWqRawKetDaeCWPH3V18CHo',
      // apiKey: 'AIzaSyDnL6GdV-FWidi8Uh2uDjIu2uRGQtgZOYc',
      libraries: ['places']
    }),
    Ng2SearchPipeModule,
    NgSelectModule,
    ModalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
