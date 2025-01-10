import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { ExportService } from 'src/app/export.service';

@Component({
  selector: 'app-show-wise-booking-report',
  templateUrl: './show-wise-booking-report.component.html',
  styleUrls: ['./show-wise-booking-report.component.css'],
})
export class ShowWiseBookingReportComponent implements OnInit {
  dataList1: any[] = [];

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
  pageSize2 = 10;
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();

  current = new Date();
  month = this.today;
  type: any;
  exportbook = [];
  bookingsexcel: any[] = [];
  DATE: any;
  THEATRE_ID: any;
  DRAMA_ID: any;
  SHOW_ID: any = [];
  columns: string[][] = [
    ['THEATRE_NAME', 'THEATRE_NAME'],
    ['DRAMA_NAME', 'DRAMA_NAME'],
    ['DATE', 'DATE'],
    ['TOTAL_SEATS', 'TOTAL_SEATS'],
    ['RESERVED_SEATS', 'RESERVED_SEATS'],
    // ['AVAILABLE_FOR_SALE', 'AVAILABLE_FOR_SALE'],
    // ['SOLD_TIKCETS', 'SOLD_TIKCETS'],
    // ['SOLD_AMOUNT', 'SOLD_AMOUNT'],
    // ['PENDING_TICKETS', 'PENDING_TICKETS'],
  ];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _exportService: ExportService
  ) {}
  show: any = [];
  category: any;
  userId: any;
  theatreId: any;
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    this.gettheatername();
    this.getshowname();
    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
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

  NAME: any;
  ID: any;
  theater: any = [];

  gettheatername() {
    this.api.getTheatreMaster(0, 0, '', '', 'AND STATUS = 1').subscribe(
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
  cityIDS: any = [];
  Master: any;
  CityData: any;
  a(event: any) {
    this.SHOW_ID = [];

    this.api.getTheatreMaster(0, 0, '', '', ' AND ID = ' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          var DataList: any = [];
          this.cityIDS = [];
          this.Master = [];
          DataList = data['data'];
          for (var i = 0; i < DataList.length; i++) {
            this.cityIDS.push(DataList[i].CITY_ID);
          }
          this.api
            .getdramaMaster(
              0,
              0,
              'ID',
              'ASC',
              'AND STATUS = 1  AND CITY_ID in (' + this.cityIDS + ')'
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.show = data['data'];
                } else {
                  this.message.error("Can't Load Drama Name", '');
                }
              },

              (err) => {
                console.log(err);
              }
            );
        } else {
          this.message.error("Can't Load Theater Name", '');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getshowname() {
    this.api.getdramaMaster(0, 0, '', '', 'AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.show = data['data'];
        } else {
          this.message.error("Can't Load Show Name", '');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  extraFilter: any;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
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

    if (exportInExcel == false) {
      this.api
        .getshow(
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
    } else {
      this.api
        .getshow(
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
              this.exportbook = data['data'];
              this.exportexcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  value1: any;
  value2: any;
  value: any;
  applyFilter() {
    if (this.DATE != undefined) {
      this.value1 = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.value2 = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    this.filterQuery = '';

    if (
      this.value1 != undefined &&
      this.value2 != undefined &&
      this.THEATRE_ID != undefined &&
      (this.SHOW_ID != undefined && this.SHOW_ID.length>0)
    ) {
      this.filterQuery +=
        " AND DATE BETWEEN '" +
        this.value1 +
        "' AND '" +
        this.value2 +
        ' ' +
        "' AND THEATRE_ID = '" +
        this.THEATRE_ID +
        "' AND DRAMA_ID in (" +
        this.SHOW_ID +
        ")";
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (
      this.value1 != undefined &&
      this.value2 != undefined &&
      this.THEATRE_ID != undefined
    ) {
      this.filterQuery +=
        " AND DATE BETWEEN '" +
        this.value1 +
        "' AND '" +
        this.value2 +
        "' AND THEATRE_ID = '" +
        this.THEATRE_ID +
        "'";
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (
      this.value1 != undefined &&
      this.value2 != undefined &&
      (this.SHOW_ID != undefined  && this.SHOW_ID.length>0)
    ) {
      this.filterQuery +=
        " AND DATE BETWEEN '" +
        this.value1 +
        "' AND '" +
        this.value2 +
        "' AND DRAMA_ID in (" +
        this.SHOW_ID +
        ")";
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (this.THEATRE_ID != undefined && (this.SHOW_ID != undefined  && this.SHOW_ID.length>0)) {
      this.filterQuery +=
        " AND THEATRE_ID = '" +
        this.THEATRE_ID +
        "' AND DRAMA_ID in (" +
        this.SHOW_ID +
        ")";

        
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (this.value1 != undefined && this.value2 != undefined) {
      this.filterQuery +=
        " AND DATE BETWEEN '" + this.value1 + "' AND '" + this.value2 + "'";
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (this.THEATRE_ID != undefined) {
      this.filterQuery += " AND THEATRE_ID = '" + this.THEATRE_ID + "'";
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (this.SHOW_ID != undefined  && this.SHOW_ID.length>0) {
      this.filterQuery +=  "' AND DRAMA_ID in (" +
      this.SHOW_ID +
      ")";;
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    } else if (
      this.value1 == undefined &&
      this.value2 == undefined &&
      this.THEATRE_ID == undefined &&
      this.SHOW_ID == undefined
    ) {
      this.message.error('Please Select filter values', '');
    } else {
      this.filterQuery = ' ';

      this.filterClass = 'filter-invisible';
      this.search(true);
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.DATE = [];
    this.show = [];
    this.value1 = [];
    this.value2 = [];
    this.THEATRE_ID = null;
    this.SHOW_ID = null;

    this.filterQuery = '';
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

    if (this.pageSize2 != pageSize) {
      this.pageSize2 = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search(true);
  }

  importInExcel() {
    this.search(true, true);
  }
  exportexcel(): void {
    var arry1 = [];
    var obj1: any = new Object();
    if (this.exportbook.length > 0) {
      for (var i = 0; i < this.exportbook.length; i++) {
        obj1['Theatre Name'] = this.exportbook[i]['THEATRE_NAME'];
        obj1['Drama Name'] = this.exportbook[i]['DRAMA_NAME'];
        obj1['Booking ID'] = this.exportbook[i]['BOOKING_ID'];
        obj1['Mobile Number'] = this.exportbook[i]['MOBILE_NO'];
        obj1['Seat Numbers'] = this.exportbook[i]['SEAT_NUMBERS'];
        obj1[' Date'] = this.exportbook[i]['DATE'];
        obj1['Start Time'] = this.exportbook[i]['START_TIME'];
        obj1['Payment Gateway ID'] = this.exportbook[i]['PAYMENT_GATEWAY_ID'];
        obj1['Total Amonut'] = this.exportbook[i]['TOTAL_AMOUNT'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.exportbook.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Show Wise Summary Report"' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There Is No Data', '');
    }
  }
}
