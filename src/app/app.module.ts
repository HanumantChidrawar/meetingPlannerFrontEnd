import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { MeetingModule } from './meeting/meeting.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from './app.service';
import {  NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import { Location } from '@angular/common';


import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';

//for toast message
import { ToastrModule } from 'ngx-toastr';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { GeneralDashboardComponent } from './general-dashboard/general-dashboard.component';

import { FormsModule } from '../../node_modules/@angular/forms';
//import 'flatpickr/dist/flatpickr.css';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    GeneralDashboardComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    HttpClientModule,
    NgxSpinnerModule,
    DragAndDropModule.forRoot(),
    FormsModule,
    UserModule,
    MeetingModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'admin/dashboard', component: AdminDashboardComponent},
      { path: 'user/dashboard', component: GeneralDashboardComponent},
      { path: 'pageNotFound', component: PageNotFoundComponent },
      { path: 'serverError', component: ServerErrorComponent },
      { path: '*', component: PageNotFoundComponent },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  providers: [AppService,Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
