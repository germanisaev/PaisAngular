
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../../shared/models/employee.model';
import { EmployeeService } from '../../shared/services/employee.service';
import { Department } from '../../shared/models/department.model';
import { RoleCompany } from '../../shared/models/role.model';
import { ItemSelect } from '../../shared/models/itemSelect.model';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, 
  Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import {
  SortableHeaderDirective,
  SortEvent,
  compare,
} from '../../shared/directives/sortable.directive';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  providers: [EmployeeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnChanges {
  
  @Input() public employees: Employee[] = [];
  @Input() public departments!: Department[];
  @Input() public roles!: RoleCompany[];
  @Input() public ages!: ItemSelect[];

  @Output() public onReset = new EventEmitter<boolean>();
  addItem(flag: any) {
    this.onReset.emit(flag);
  }
  
  @Output() public onSelected = new EventEmitter<Employee>();
  selectItem(employee: Employee) {  
    this.onSelected.emit(employee); 
    this.employeeDetail = employee;   
  }
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  data: Array<Employee> = this.employees;
  employeesData: Array<Employee> = this.employees;
  employeeDetail?: Employee;
  searchText: string = '';
  sortText: string = '';
  closeResult: string = '';
  public pagedData: any;

  title = '';
  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 5;
  pageSizes = [5, 10, 50];

  constructor(private modalService: NgbModal, 
    private _service: EmployeeService, 
    private ref: ChangeDetectorRef) { }
  
  deptName(deptId: any) { return this.departments.find(x => x.departmentId == deptId)?.departmentName; }
  roleName(roleId: any) { return this.roles.find(x => x.roleId == roleId)?.roleName; }
  ageName(key: any) { return this.ages.find(x => x.key == key)?.value; }

  setCurrentPageArr(slicedArr: Array<any>) {
    this.pagedData = slicedArr;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'employees': {
            this.doEmployees(this.employees);
            break;
          }
          case 'departments': {
            this.doDepartments(this.departments);
            break;
          }
          case 'roles': {
            this.doRoles(this.roles);
            break;
          }
          case 'ages': {
            this.doAges(this.ages);
            break;
          }
        }
      }
    }
  }

  doEmployees(input: any) {
    if(input) {
      this.employees = [...input];
    }
  }

  doDepartments(input: any) {
    if(input) {
      this.departments = input;
    }
  }

  doRoles(input: any) {
    if(input) {
      this.roles = input;
    }
  }

  doAges(input: any) {
    if(input) {
      this.ages = input;
    }
  }

  ngOnInit(): void {
    this._service.refreshNeeded$.subscribe(() => {
      this.doEmployees(this.employees);
    });
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveTutorials();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);
  }
  
  open(content: any, employeeId: any) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteEmployee(employeeId); 
        this._service.deleteItem(employeeId).subscribe(response => {
          console.log(response);
          this.ref.detectChanges();
        });
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  
  
  private getDismissReason(reason: any): string {  
    if (reason === ModalDismissReasons.ESC) {  
      return 'by pressing ESC';  
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
      return 'by clicking on a backdrop';  
    } else {  
      return `with: ${reason}`;  
    }  
  }

  deleteEmployee(id: any) {  
    this.employees = this.employees.filter(x => x.employeeId !== id); 
  }
}
