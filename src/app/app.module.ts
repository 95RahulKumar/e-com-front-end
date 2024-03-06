import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfirmationComponent } from './shared/confirmation/confirmation.component';
import { ButtonComponent } from './shared/button-component/button.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { MaterialModule } from './shared/material-module/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconModule } from './shared/custom-icon/icon.module';
import { LogintempComponent } from './shared/login-popup/logintemp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusMessageModule } from './shared/statusMessage/status-message.module';
import { CookieService } from 'ngx-cookie-service';
import { UserModule } from './view-component/user.module';
import { AdminModule } from './view-component/admin.module';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ButtonModule } from './shared/button-component/button.module';
import { ChatComponent } from './view-component/chat/chat.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoaderComponent,
    ConfirmationComponent,
    LogintempComponent,
    DialogComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IconModule,
    HttpClientModule,
    MatFormFieldModule,
    MaterialModule,
    ReactiveFormsModule,
    StatusMessageModule,
    ButtonModule,
    UserModule,
    AdminModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  entryComponents: [ConfirmationComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
