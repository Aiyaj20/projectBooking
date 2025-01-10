import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExportService } from 'src/app/export.service';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-booking-confirm-report',
  templateUrl: './booking-confirm-report.component.html',
  styleUrls: ['./booking-confirm-report.component.css'],
})
export class BookingConfirmReportComponent implements OnInit {
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
  theatreList: any[] = [];
  cityList: any[] = [];
  showList: any[] = [];
  bookingsexcel: any[] = [];
  userId: any;
  theatreId: any;
  THEATRE_ID: any;
  CITY_ID: any;
  SHOW_ID: any;
  PAYMENT_MODE: any;
  selectedDate: any = [];
  dateFormat = 'dd/MM/yyyy';
  retriveimgUrl=appkeys.retriveimgUrl
  columns: string[][] = [
    ['THEATRE_NAME', ''],
    ['CITY_NAME', ''],
    ['SHOW_NAME', ''],
    ['SHOW_DATE', ''],
    ['MOBILE_NO', ''],
    ['CART_ID', ''],
    ['PAYMENT_DATE_TIME', ''],
    ['SEAT_NUMBERS', ''],
    ['TOTAL_AMOUNT', ''],
  ];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private notify: NzNotificationService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    // if (this.userId != 1) {
    //   this.theaterList();
    // } else {
    //   this.theatermasterget();
    // }
    // this.loadCity();
    this.loadShow();
  }
  theaterList() {
    this.api
      .getTheatreMaster(0, 0, '', '', ' AND ID in(' + this.theatreId + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.theatreList = data['data'];
          } else {
            this.message.error("Can't Load Theater Name", '');
            this.theatreList = [];
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  loadCity() {
    this.api.getCityMaster(0, 0, '', '', ' ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        } else {
          this.message.error("Can't Load City Name", '');

          this.cityList = [];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadShow() {
    this.api
      .getmaster(
        0,
        0,
        'ID',
        'ASC',
        " AND BOOKING_STATUS in ('S','C')"
        // 'AND STATUS = 1  AND CITY_ID in (' + this.cityIDS + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.showList = data['data'];
          } else {
            this.message.error("Can't Load Show Name", '');
            this.showList = [];
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
  search(reset: boolean = false, exportInExcel: boolean = false) {
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
    if (!exportInExcel) {
      this.api
        .getCartMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          " AND ADMIN_CONFIRMATION_STATUS = 'D' AND BOOKING_STATUS = 'B'" +
            this.extraFilter +
            filter
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
    } else {
      this.api
        .getCartMaster(
          0,
          0,
          this.sortKey,
          sort,
          " AND ADMIN_CONFIRMATION_STATUS = 'D' AND BOOKING_STATUS = 'B'" +
            this.extraFilter +
            filter
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


    if (this.selectedDate.length>0) {
    this.startValue = this.datePipe.transform(this.selectedDate[0], 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.selectedDate[1], 'yyyy-MM-dd');
      this.filterQuery =
        " AND ( SHOW_DATE between '" +
        this.datePipe.transform(this.startValue, 'yyyy-MM-dd') +
        ':00:00:00' +
        "' AND '" +
        this.datePipe.transform(this.endValue, 'yyyy-MM-dd') +
        ':23:59:59' +
        "') ";

      this.isOk = true;
      this.filterClass = 'filter-invisible';
    }

    if (this.CITY_ID) {
      this.filterQuery += ' AND CITY_ID = ' + this.CITY_ID;
    }
    if (this.THEATRE_ID) {
      this.filterQuery += ' AND THEATRE_ID = ' + this.THEATRE_ID;
    }
    if (this.SHOW_ID) {
      this.filterQuery += ' AND SHOW_ID = ' + this.SHOW_ID;
    }
    if (this.PAYMENT_MODE) {
      this.filterQuery += " AND PAYMENT_MODE = '" + this.PAYMENT_MODE+"'";
    }
    if (this.filterQuery) {
      this.search();
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
    } else {
      this.message.error('Please Select Filter Values', '');
      this.loadingRecords = false;

    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.selectedDate = [];
    this.startValue = null;
    this.endValue = null;
    this.THEATRE_ID = null;
    this.CITY_ID = null;
    this.SHOW_ID = null;
    this.PAYMENT_MODE = null;
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
          this.theatreList = data['data'];
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
        obj1['Theatre Name'] = this.bookingsexcel[i]['THEATRE_NAME'];
        obj1['City Name'] = this.bookingsexcel[i]['CITY_NAME'];
        obj1['Show Name'] = this.bookingsexcel[i]['SHOW_NAME'];

        obj1['Show Date'] = this.datePipe.transform(
          this.bookingsexcel[i]['SHOW_DATE'],
          'yyyy-MM-dd'
        );
        obj1['Mobile Number'] = this.bookingsexcel[i]['MOBILE_NO'];
        obj1['Cart ID'] = this.bookingsexcel[i]['CART_ID'];
        obj1['Payment Date Time'] = this.datePipe.transform(
          this.bookingsexcel[i]['PAYMENT_DATE_TIME'],
          'yyyy-MM-dd'
        );

        obj1['Seat Numbers'] = this.bookingsexcel[i]['SEAT_NUMBERS'];
        obj1['Amount'] = this.bookingsexcel[i]['TOTAL_AMOUNT'];

        excelData.push(Object.assign({}, obj1));
        if (i == this.bookingsexcel.length - 1) {
          this.exportService.exportExcel(
            excelData,
            'Bookings Confirm Report"' +
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

  DateChange(event: any) {
    this.startValue = this.datePipe.transform(event[0], 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(event[1], 'yyyy-MM-dd');
  }

  openPaymentReceipt(data:any){
    window.open(this.retriveimgUrl+"confirmationPdf/"+data.PDF_URL)
  }
}
