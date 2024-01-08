import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { LayoutComponent } from './components/layout/layout.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { SortByPipe } from './shared/pipes/sort-by.pipe';
import { SortableHeaderDirective } from './shared/directives/sortable.directive';
import { PaginationComponent } from './shared/directives/pagination/pagination.component';
import { LoginComponent } from './components/login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbdModalContent } from './shared/directives/NgbdModalContent ';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    EmployeeListComponent,
    EmployeeDetailsComponent,
    SortableHeaderDirective,
    FilterPipe,
    SortByPipe,
    PaginationComponent,
    LoginComponent,
    NgbdModalContent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  //entryComponents: [ EmployeeDetailsComponent ]
})
export class AppModule { }
