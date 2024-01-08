
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from './shared/models/employee.model';
import { EmployeeService } from './shared/services/employee.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [EmployeeService]
})
export class AppComponent implements OnInit, OnDestroy  {
  searchTerm!: string;
  employees!: Employee[];
  allEmployees!: Employee[];

  getEmployeesSub!: Subscription;


  constructor(private _service: EmployeeService) { }

  ngOnDestroy(): void {
    this.getEmployeesSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getEmployees();

    //this.getEmployeesSub = this._service.getEmployees().subscribe((response: any) => this.response = response);
  }

  getEmployees(): void {
    this.getEmployeesSub = this._service.getItems().subscribe((data: Employee[]) => {
      this.employees = data;
      this.allEmployees = this.employees;
    });
  }

  search(searchText: any): void {
    this.employees = this.allEmployees.filter((val: any) => val.firstName.trim().toLowerCase().includes(searchText.value));
    
  }

  
}
