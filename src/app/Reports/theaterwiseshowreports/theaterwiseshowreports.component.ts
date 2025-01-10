import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ExportService } from 'src/app/export.service';
@Component({
  selector: 'app-theaterwiseshowreports',
  templateUrl: './theaterwiseshowreports.component.html',
  styleUrls: ['./theaterwiseshowreports.component.css'],
})
export class TheaterwiseshowreportsComponent implements OnInit {
  dataList1: any = [];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private notify: NzNotificationService,
    private exportService:ExportService
  ) {}

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

  bookingsexcel: any[] = [];

  columns: string[][] = [
    ['THEATRE_NAME', 'Theater Name'],
    ['DRAMA_NAME', 'Drama Name'],

    ['CITY_NAME', 'City Name'],
    ['DATE', 'Date'],
    ['START_TIME', 'Start Time'],
    ['END_TIME', 'End Time'],
    ['BOOKING_STATUS', 'Booking Status'],
  ];
  userId: any;
  theatreId: any;
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    if (this.userId != 1) {
      this.theaterList();
    } else {
      this.theatermasterget();
    }
  }
  theaterList() {
    this.api
      .getTheatreMaster(0, 0, '', '', ' AND ID in(' + this.theatreId + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList1 = data['data'];
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
  search(reset: boolean = false,exportInExcel:boolean=false) {
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
    var filter = '';
    if (likeQuery) filter = this.filterQuery + likeQuery;
    else filter = this.filterQuery;
    this.query = likeQuery;
    if (this.userId != 1) {
      this.extraFilter = ' AND THEATRE_ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }
    if(!exportInExcel){
      this.api
      .gettheaterwiseshowreports(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilter + likeQuery + this.filterQuery + ' AND IS_ACTIVE=1'
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
    }
   else{
    this.api
    .gettheaterwiseshowreports(
      0,
      0,
      this.sortKey,
      sort,
      this.extraFilter + likeQuery + this.filterQuery + ' AND IS_ACTIVE=1'
    )
    .subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.bookingsexcel = data['data'];
          this.DownloadExcelFile();
         
        }
      },
      (err) => {
        console.log(err);
      }
    );
   }
    
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
      this.search(true);
    } else if (this.startValue != undefined && this.endValue != undefined) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (
      this.type != undefined &&
      this.startValue == undefined &&
      this.endValue == undefined
    ) {
      this.isFilterApplied = 'primary';
      this.filterQuery = 'AND THEATRE_ID=' + '' + this.type;
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.loadingRecords = false;
      this.notify.error('', 'Please Enter Start Date');
    } else if (this.endValue == undefined && this.startValue != undefined) {
      this.loadingRecords = false;
      this.notify.error('', 'Please Enter End Date');
    } else if (
      this.startValue != undefined &&
      this.type != undefined &&
      this.endValue == undefined
    ) {
      this.notify.error('', 'Please Enter End Date');
    } else if (
      this.endValue != undefined &&
      this.type != undefined &&
      this.startValue == undefined
    ) {
      this.notify.error('', 'Please Enter Start Date');
    } else {
      this.loadingRecords = false;
      this.notify.error('', 'Please Select  Filter Value');
    }
    ///local
    if (this.userId != 1) {
      this.extraFilter = ' AND THEATRE_ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }

    // this.filterClass='filter-invisible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    // this.dataList = [];
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
    this.api.getTheatreMaster(0, 0, '', '', ' ').subscribe(
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


  DownloadExcel(): void {
    this.search(false, true);
  }
  convertTime(timeStr: any) {
    if (!timeStr) {
      return ''; // Return an empty string or handle the null/undefined case appropriately
    }

    // Split the time string into hours and minutes
    let [hours, minutes] = timeStr.split(':');

    // Convert hours and minutes to numbers
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Determine AM/PM suffix
    let ampm = hours >= 12 ? 'PM' : 'AM';

    // Return the formatted time string without converting to 12-hour format
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }
  DownloadExcelFile(): void {
    const excelData = [];
    if (this.bookingsexcel.length > 0) {
      for (let i = 0; i < this.bookingsexcel.length; i++) {
        const obj1: any = {};
        obj1['Theater Name'] = this.bookingsexcel[i]['THEATRE_NAME'];
        obj1['Drama Name'] = this.bookingsexcel[i]['DRAMA_NAME'];
        obj1['City Name'] = this.bookingsexcel[i]['CITY_NAME'];
        obj1['Date'] = this.datePipe.transform(this.bookingsexcel[i]['DATE'],'dd-MM-yyyy');
        // if(this.bookingsexcel[i]['START_TIME'] && this.bookingsexcel[i]['END_TIME']){
          obj1['Start Time'] = this.convertTime(this.bookingsexcel[i]['START_TIME']);
          obj1['End Time'] = this.bookingsexcel[i]['END_TIME']?this.convertTime(this.bookingsexcel[i]['END_TIME']):'';
        // }
        obj1['Booking Status'] = this.bookingsexcel[i]['BOOKING_STATUS'];
        excelData.push(Object.assign({}, obj1));
        if (i == this.bookingsexcel.length - 1) {
          this.exportService.exportExcel(
            excelData,
            'Theater Wise Show Report"' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There Is No Data', '');
    }
  }

  getTimeIn12Hour(time: any) {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }
  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.startValue) < 0;
}
