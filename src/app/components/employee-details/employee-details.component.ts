import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, 
  OnInit, EventEmitter, Output, KeyValueDiffer, KeyValueDiffers, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../shared/services/employee.service';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../../shared/models/employee.model';
import { Department } from '../../shared/models/department.model';
import { RoleCompany } from '../../shared/models/role.model';
import { ItemSelect } from '../../shared/models/itemSelect.model';
import { NgbdModalContent } from '../../shared/directives/NgbdModalContent ';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailsComponent implements OnInit, OnChanges, DoCheck {

  @Input() public employees!: Employee[];
  @Input() public departments!: Department[];
  @Input() public roles!: RoleCompany[];
  @Input() public ages!: ItemSelect[];
  @Input() public isReset!: boolean;

  @Output() public onAdded = new EventEmitter<Employee>();
  addItem(emp: any) {
    this.onAdded.emit(emp);
  }

  @Output() elementChange = new EventEmitter<any>();
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private _element: any;

  get employee() { return this._element; }

  @Input()
  set employee(newVal: Employee) {
    if (this._element === newVal) { return; }
    this._element = newVal;
    this.ref.markForCheck();
    this.elementChange.emit(this._element);
  }

  private elementDiffer: KeyValueDiffer<string, any>;

  public detailForm!: FormGroup;
  itemRef!: Employee;
  detailId!: number;
  submitted = false;
  closeResult: string = '';
  numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
  bodyText!: string;

  constructor(
    private formBuilder: FormBuilder,
    private _service: EmployeeService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private differs: KeyValueDiffers
  ) {
    this.elementDiffer = this.differs.find({}).create();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'isReset': {
            if(this.isReset) {
              this.detailForm.reset();
            }
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
  
  ngDoCheck(): void {
    const changes = this.elementDiffer.diff(this.employee);
    if (changes) {
      this.employee = { ...this.employee };
      this.getDataById(this.employee);
    }
  }

  ngOnInit(): void {
    this.onCreate();
  }

  onCreate() {
    let data = localStorage.getItem('user');
    const user = JSON.parse(data!);
    
    console.log(user.username);

    this.detailForm = this.formBuilder.group({
      employeeId: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roleCompany: [null, [Validators.required, Validators.min(1), Validators.pattern(this.numericNumberReg)]],
      departmentId: [null, [Validators.required, Validators.min(1), Validators.pattern(this.numericNumberReg)]],
      ageDate: [null, [Validators.required, Validators.min(1), Validators.pattern(this.numericNumberReg)]],
      carOwner: [0],
      userName: [user.username]
    });
  }

  getDataById(emp: Employee) {
    this.detailForm.patchValue({
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      roleCompany: emp.roleCompany,
      departmentId: emp.departmentId,
      ageDate: emp.ageDate,
      carOwner: emp.carOwner,
      userName: emp.userName
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.detailForm.controls; }

  onSubmit() {

    this.submitted = true;
    
    if (this.detailForm.invalid) {
      return;
    }

    let data = localStorage.getItem('user');
    const user = JSON.parse(data!);

    let ctrl = this.detailForm.controls["carOwner"];
    let res = ctrl.value ? 1 : 0;
    this.detailForm.get("carOwner")?.patchValue(res);
    this.detailForm.get("userName")?.patchValue(user.username);
    this.itemRef = this.detailForm.value;


    if(this.employee) {
      setTimeout(() => {
        this._service.updateItem(this.itemRef).subscribe(response => {
          console.log(response);
          const modalRef = this.modalService.open(NgbdModalContent, { ariaLabelledBy: 'modal-basic-title' });
          modalRef.componentInstance.headerTitle = 'Employee Update';
          modalRef.componentInstance.bodyText = `Thanks for updating the employee ${this.itemRef?.firstName}`;
          modalRef.result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
            }, 
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
          this.ref.detectChanges();
        });
      }, 1000);
    } else {
      
      for(let emp of this.employees) {
        if(emp.userName == user.username) {
          const modalRef = this.modalService.open(NgbdModalContent, { ariaLabelledBy: 'modal-basic-title' });
          modalRef.componentInstance.headerTitle = 'Employee Add';
          modalRef.componentInstance.bodyText = `An employee may submit only one form '${user.username}'`;
          modalRef.result.then(
            (result) => {
              this.onCreate();
              this.closeResult = `Closed with: ${result}`;
            }, 
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
          return;
        }
      }
      
      setTimeout(() => {
        this._service.createItem(this.itemRef).subscribe(response => {

          this.employees.push(this.itemRef);
          this.onCreate();
          
          const modalRef = this.modalService.open(NgbdModalContent, { ariaLabelledBy: 'modal-basic-title' });
          modalRef.componentInstance.headerTitle = 'Employee Added';
          modalRef.componentInstance.bodyText = `Thanks for adding for new employee ${this.itemRef?.firstName}`;
          modalRef.result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
            }, 
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
          this.ref.detectChanges();
        });
      }, 1000);
    }  
  }

  clearForm() {
    this.detailForm.patchValue({
      firstName: '',
      lastName: '',
      roleCompany: 0,
      departmentId: 0,
      ageDate: 0,
      carOwner: 0
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

}
