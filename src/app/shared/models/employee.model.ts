import { SortColumn, SortDirection } from "../directives/sortable.directive";

export interface Employee {
    employeeId: number;
    firstName: string;
    lastName: string;
    roleCompany: number;
    departmentId: number;
    ageDate: number;
    carOwner: number;
    userName: string;
    /* departmentName: string;
    roleName: string; */
}

export interface SearchResult {
	employees: Employee[];
	total: number;
}

export interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}