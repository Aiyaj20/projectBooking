import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ExportService } from 'src/app/export.service';
@Component({
  selector: 'app-cart-reports',
  templateUrl: './cart-reports.component.html',
  styleUrls: ['./cart-reports.component.css'],
})
export class CartReportsComponent implements OnInit {
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
  cartdetails: any = [];
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
  cartsexcel: any[] = [];
  userId: any;
  theatreId: any;
  theater: any = [];
  columns: string[][] = [
    ['THEATRE_NAME', 'Theater_Name'],
    ['SHOW_NAME', 'Show Name'],
    ['SHOW_DATE', 'Date'],
    ['START_TIME', 'Start Time'],
    ['END_TIME', 'End Time'],
    ['MOBILE_NO', 'Mobile Number'],
    ['SEAT_NUMBERS', 'Seat Numbers'],
    ['TOTAL_AMOUNT', 'Total Amount'],
  ];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private notify: NzNotificationService,
    private exportService:ExportService
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
  search(reset: boolean = false,exporttoexcel:boolean=false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '';
      this.sortValue = '';
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
      this.extraFilter = ' AND THEATRE_ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }
    if(!exporttoexcel){
      this.api
      .getcartreports(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilter + likeQuery + this.filterQuery  + " "
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.cartdetails = data['data'];
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
  
      if(exporttoexcel){
        this.api
        .getcartreports(
          0,
          0,
          this.sortKey,
          '',
          this.extraFilter + likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.cartsexcel = data['data'];
              this.DownloadExcelFile()
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
        " AND SHOW_DATE between '" +
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
        " AND SHOW_DATE between '" +
        this.startValue  +
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
    } else if (this.startValue == undefined && this.endValue != undefined) {
      this.notify.error('', 'Please Select Start Date');
      this.loadingRecords = false;
    } else if (this.endValue == undefined && this.startValue != undefined) {
      this.notify.error('', 'Please Select End Date');
      this.loadingRecords = false;
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
      this.loadingRecords = false;
      this.notify.error('', 'Please Select Filter Value');
    }
    if (this.userId != 1) {
      this.extraFilter = ' AND THEATRE_ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }
    ///local
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
    if (this.cartsexcel.length > 0) {
      for (let i = 0; i < this.cartsexcel.length; i++) {
        const obj1: any = {};
        obj1['Theatre Name'] = this.cartsexcel[i]['THEATRE_NAME'];
        obj1['Show Name'] = this.cartsexcel[i]['SHOW_NAME'];
        obj1['Show Date'] = this.datePipe.transform(this.cartsexcel[i]['SHOW_DATE'],'dd-MM-yyyy');
        // if(this.cartsexcel[i]['START_TIME'] && this.cartsexcel[i]['END_TIME']){
          // obj1['Start Time'] =this.datePipe.transform(this.getTimeIn12Hour(this.cartsexcel[i]['START_TIME']),'hh:mm a');
          // obj1['End Time'] = this.datePipe.transform(this.getTimeIn12Hour(this.cartsexcel[i]['END_TIME']),'hh:mm a');
          obj1['Start Time'] = this.convertTime(this.cartsexcel[i]['START_TIME']);
          obj1['End Time'] = this.cartsexcel[i]['END_TIME']?this.convertTime(this.cartsexcel[i]['END_TIME']):'';
        // }
        obj1['Mobile Number'] = this.cartsexcel[i]['MOBILE_NO'];
        obj1['Seat Numbers'] = this.cartsexcel[i]['SEAT_NUMBERS'];
        obj1['Total Amount'] = this.cartsexcel[i]['TOTAL_AMOUNT'];

        excelData.push(Object.assign({}, obj1));
        if (i == this.cartsexcel.length - 1) {
          this.exportService.exportExcel(
            excelData,
            'Cart Details Report"' +
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
