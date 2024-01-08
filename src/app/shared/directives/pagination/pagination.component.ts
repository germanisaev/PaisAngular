import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  private _totalPages!: number;
  public totalList: Array<any> = [];

  @Input('list-items') 
  set listItems(value: any) {
    if (value && value !== this.totalList) {
      this.totalList = value;
      this._totalPages  = value.length;
    }
  }

  public currentIndex = 0;

  @Input('page-count') pageCount = 5;
  @Output()  paginate = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  paginateCard() {
    this.paginate.emit(this.totalList.slice(this.currentIndex, this.currentIndex + this.pageCount));
  }

  prevPage() {
    if (this.currentIndex === 0) {
      return;
    }
    this.currentIndex -= this.pageCount;
    this.paginateCard();
  }

  nextPage() {
    if (this.currentIndex >= (this.totalList.length - this.pageCount)) {
      return;
    }
    this.currentIndex += this.pageCount;
    this.paginateCard();
  }
}
