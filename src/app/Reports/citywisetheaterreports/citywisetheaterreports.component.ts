import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-citywisetheaterreports',
  templateUrl: './citywisetheaterreports.component.html',
  styleUrls: ['./citywisetheaterreports.component.css'],
})
export class CitywisetheaterreportsComponent implements OnInit {
  isFilterApplied: any = 'default';
  filterQuery: string = '';
  isOk: boolean = false;
  totalRecords: any;
  pageSize = 10;
  pageIndex = 1;
  sortKey: string = 'id';
  sortValue: string = 'desc';
  searchText: any = '';
  loadingRecords = true;
  filterClass: string = 'filter-invisible';
  startValue: any;
  endValue: any;
  today2 = new Date();
  isSpinning = false;
  endOpen = false;
  startOpen = false;
  dates: any = [];
  bookingdetails: any = [];
  query: any;
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();

  current = new Date();
  month = this.today;
  type: any;
  dataList1: any[] = [];
  bookingsexcel: any[] = [];
  userId: any;
  theatreId: any;
  theater: any = [];

  columns: string[][] = [
    ['CITY_NAME', 'City Name'],
    ['ADDRESS', 'Address'],
    ['LATITUDE', 'Latitude'],
    ['LONGITUDE', 'Longitude'],
  ];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private notify: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
    this.theatermasterget();
  }
  theaterList() {
    this.api
      .getTheatreMaster(0, 0, '', '', ' AND ID in(' + this.theatreId + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.theater = data['data'];
          } else {
            this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  keyup(event: any) {
    this.search();
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }
  extraFilter: any;
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.userId != 1) {
      this.extraFilter = ' AND ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }

    this.api
      .getcitywisetheaterreports(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilter + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.bookingdetails = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.api
      .getcitywisetheaterreports(
        0,
        0,
        this.sortKey,
        sort,
        this.extraFilter + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.bookingsexcel = data['data'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');

    if (
      this.startValue != undefined &&
      this.endValue != undefined &&
      this.type != undefined
    ) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' " +
        ' AND THEATRE_ID=' +
        this.type;
      this.filterClass = 'filter-invisible';
    } else if (this.startValue != undefined && this.endValue != undefined) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
    } else if (
      this.type != undefined &&
      this.startValue == undefined &&
      this.endValue == undefined
    ) {
      this.isFilterApplied = 'primary';
      this.filterQuery = 'AND THEATRE_ID=' + '' + this.type;
      this.filterClass = 'filter-invisible';
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.notify.error('', 'Please Select Start Date');
    } else if (this.endValue == undefined && this.startValue != undefined) {
      this.notify.error('', 'Please Select End Date');
    } else if (
      this.startValue != undefined &&
      this.type != undefined &&
      this.endValue == undefined
    ) {
      this.notify.error('', 'Please Select End Date');
    } else if (
      this.endValue != undefined &&
      this.type != undefined &&
      this.startValue == undefined
    ) {
      this.notify.error('', 'Please Select Start Date');
    } else {
      this.notify.error('', 'Please Select Any Filter Value');
    }
    ///local
    this.api
      .getcitywisetheaterreports(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;

          this.totalRecords = data['count'];
          this.bookingdetails = data['data'];
          this.bookingsexcel = data['data'];
        },
        (err) => {
          console.log(err);
        }
      );
    this.api
      .getcitywisetheaterreports(0, 0, this.sortKey, sort, this.filterQuery)
      .subscribe(
        (data) => {
          this.bookingsexcel = data['data'];
        },
        (err) => {
          console.log(err);
        }
      );
    // this.filterClass='filter-invisible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';

    this.startValue = null;
    this.endValue = null;
    this.filterQuery = '';
    this.month = this.today;
    this.type = null;
    this.isFilterApplied = 'default';
    this.search();
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }

  startDateChange() {
    var startDate = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  theatermasterget() {
    this.api.getTheatreMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.dataList1 = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  DownloadExcel() {
    this.isOk = true;
    this.isSpinning = true;
    if (this.totalRecords == 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('There is No Data Found..', '');
    } else {
      this.api
        .getcitywisetheaterreports(
          0,
          0,
          this.sortKey,
          '',
          this.query + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.bookingsexcel = data['data'];
              this.isSpinning = false;
              const element = window.document.getElementById('downloadExcel');
              if (element != null) element.click();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  getTimeIn12Hour(time: any) {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.startValue) < 0;
}
