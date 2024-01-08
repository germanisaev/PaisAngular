import { Department } from "./department.model";
import { Employee } from "./employee.model";
import { RoleCompany } from "./role.model";

export interface Init {
    departments: Department[];
    employees: Employee[];
    roles: RoleCompany[];
}