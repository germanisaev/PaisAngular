import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee.service';
import { Employee } from '../../shared/models/employee.model';
import { RoleService } from '../../shared/services/role.service';
import { DepartmentService } from '../../shared/services/department.service';
import { Observable, Subscription } from 'rxjs';
import { Department } from '../../shared/models/department.model';
import { RoleCompany } from '../../shared/models/role.model';
import { ItemSelect } from '../../shared/models/itemSelect.model';
import { User } from '../../shared/models/user.model';
import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  //public data!: Init;
  public employee!: Employee;
  public employees: Employee[] = [];
  public departments!: Department[];
  public roles!: RoleCompany[];
  public isReset!: boolean;
  subscriptions: Subscription = new Subscription();
  public account$!: Observable<User>;

  Ages: ItemSelect[] = [
    {
      key: 1,
      value: "18-25"
    },
    {
      key: 2,
      value: "25-40"
    },
    {
      key: 3,
      value: "40-60"
    },
    {
      key: 4,
      value: "60-80"
    },
    {
      key: 5,
      value: "80-99"
    }
  ];

  constructor(private _serviceEmployee: EmployeeService, 
              private _serviceRole: RoleService, 
              private _serviceDepartment: DepartmentService,
              private accountService: AccountService,
              private ref: ChangeDetectorRef,) {

                this.account$ = this.accountService.getUser;
               }

  ngAfterViewInit(): void {
    this.getInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.getInit();
  }

  private getEmployees() {
    const employeeSubscription = this._serviceEmployee.getItems()
      .subscribe((itms: Employee[]) => { 
        this.employees = itms;
        this.ref.detectChanges();
      });
      this.subscriptions.add(employeeSubscription);
  }
  private getInit() {
    
    this.getEmployees();

    const departmentSubscription = this._serviceDepartment.getItems()
      .subscribe((itms: Department[]) => {
        this.departments = itms;
        this.ref.detectChanges();
      });
    

    const roleSubscription = this._serviceRole.getItems()
      .subscribe((itms: RoleCompany[]) => {
        this.roles = itms;
        this.ref.detectChanges();
      });


    this.subscriptions.add(departmentSubscription);
    this.subscriptions.add(roleSubscription);
  }

  selected(item: any) {
    this.employee = item;
  }

  reseted(flag: any) {
    this.isReset = flag;
  }

  addItem(emp: any) {
    this.employees = [...this.employees, emp];
  }
}
