import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CityMaster } from 'src/app/Models/citymaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { ExportService } from 'src/app/export.service';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css'],
})
export class TransactionReportComponent implements OnInit {
  isFilterApplied: any = 'default';
  totalRecords: any;
  pageSize = 10;
  pageIndex = 1;
  sortKey: string = 'id';
  sortValue: string = 'desc';
  searchText: any = '';
  loadingRecords = true;
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  bookingdetails: any = [];
  transactionExcelList: any = [];
  query: any;
  pageSize2 = 10;
  THEATRE_ID: any = 0;
  DRAMA_ID: any = [];
  shows: any = [];
  category: any;
  NAME: any;
  ID: any;
  theater: any = [];
  columns: string[][] = [
    ['THEATRE_NAME', 'THEATRE_NAME'],
    ['SHOW_NAME', 'SHOW_NAME'],
    ['BOOKING_ID', 'BOOKING_ID'],
    ['SEAT_NUMBERS', 'SEAT_NUMBERS '],
    ['PAYMENT_DATE_TIME', 'PAYMENT_DATE_TIME'],
    ['PAYMENT_GATEWAY_ID', 'PAYMENT_GATEWAY_ID'],
    ['TOTAL_AMOUNT', 'TOTAL_AMOUNT'],
    ['GROUP_LAYOUT_NAME', 'GROUP_LAYOUT_NAME'],
  ];
  CITY_ID = 0;
  cities: CityMaster[] = [];
  dateFormat = 'dd/MM/yyyy';
  dramas: any[] = [];
  selectedDate: any = [];
  startValue: any;
  endValue: any;
  SHOW_ID = 0;
  current = new Date();
  filterQuery: any;
  userId: any;
  theatreId: any;
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    this.getCities();
    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
    this.selectedDate[0] = new Date();
    this.selectedDate[1] = new Date();
    // this.applyFilter();
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

  gettheatername(cityid: number) {
    this.SHOW_ID = 0;
    this.DRAMA_ID = [];
    this.THEATRE_ID = 0;

    this.getdramas(cityid);
    this.CITY_ID = cityid;
    var filter = '';
    if (cityid == 0) {
    } else {
      filter = ' AND CITY_ID=' + cityid;
    }
    this.api
      .getTheatreMaster(0, 0, '', '', 'AND STATUS = 1 ' + filter)
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
  getCities() {
    this.api.getCityMaster(0, 0, 'ID', 'ASC', 'AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cities = data['data'];
        } else {
          this.message.error("Can't Load Cities", '');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getshowname(DRAMA_ID: any, THEATRE_ID: any) {
    var filter = '';
    this.DRAMA_ID = [];
    this.DRAMA_ID = DRAMA_ID;
    this.THEATRE_ID = THEATRE_ID;

    if (DRAMA_ID != null && DRAMA_ID.length == 0) {
    } else {
      filter += ' AND DRAMA_ID in (' + DRAMA_ID + ')';
    }
    if (THEATRE_ID != null && THEATRE_ID.length == 0) {
    } else {
      filter += ' AND THEATRE_ID = ' + THEATRE_ID;
    }
    this.api.getmaster(0, 0, 'ID', 'ASC', '' + filter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.shows = data['data'];
        } else {
          this.message.error("Can't Load Show Name", '');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getshowname1(event: any) {
    this.api
      .getdramaMasterForReport(0, 0, 'ID', 'ASC', ' AND THEATRE_ID = ' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dramas = data['data'];
          } else {
            this.message.error("Can't Load Show Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  getdramas(city: any) {
    var filter = '';
    if (city == 0) {
    } else {
      filter = ' AND CITY_ID=' + city;
    }
    this.api
      .getdramaMaster(0, 0, 'ID', 'ASC', 'AND STATUS = 1 ' + filter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dramas = data['data'];
          } else {
            this.message.error("Can't Load Drama Name", '');
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
      this.pageIndex=1;
      this.sortKey='';
      this.sortValue=''
    }
    // this.filterQuery = "AND DATE(PAYMENT_DATE_TIME) = '" + this.month + "'";
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
    this.filterQuery = '';
    if (
      this.selectedDate != undefined &&
      this.selectedDate != null &&
      this.selectedDate.length > 0
    ) {
      this.startValue = this.datePipe.transform(
        this.selectedDate[0],
        'yyyy-MM-dd'
      );
      this.endValue = this.datePipe.transform(
        this.selectedDate[1],
        'yyyy-MM-dd'
      );

      this.filterQuery =
        " AND ( PAYMENT_DATE_TIME  BETWEEN '" +
        this.startValue +
        " 00:00:00' AND '" +
        this.endValue +
        " 23:59:59')";
    }
    if (
      this.THEATRE_ID != undefined &&
      this.THEATRE_ID != null &&
      this.THEATRE_ID != 0
    ) {
      this.filterQuery += " AND (THEATRE_ID = '" + this.THEATRE_ID + "')";
    }
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != null &&
      this.CITY_ID != 0
    ) {
      this.filterQuery += " AND (CITY_ID = '" + this.CITY_ID + "')";
    }
    if (
      this.SHOW_ID != undefined &&
      this.SHOW_ID != null &&
      this.SHOW_ID != 0
    ) {
      this.filterQuery += ' AND SHOW_ID in (' + this.SHOW_ID + ')';
    }
    if (this.DRAMA_ID != undefined && this.DRAMA_ID.length > 0) {
      this.filterQuery += ' AND DRAMA_ID in (' + this.DRAMA_ID + ')';
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
        .getcarttransaction(
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
              // this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if(exportInExcel == true) {
      this.api
        .getcarttransaction(
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
              this.transactionExcelList = data['data'];
              this.exportexcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }

    // this.api.getcarttransaction(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.loadingRecords = false;
    //       this.totalRecords = data['count'];
    //       this.bookingdetails = data['data'];

    //     } else {
    //       this.message.error('Something Went Wrong', '');
    //       this.loadingRecords = false;
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  endOpen = false;

  applyFilter() {
   

    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = true;
    this.search(true,false);
  }

  clearFilter() {
    this.selectedDate = [];

    this.filterClass = 'filter-invisible';
    this.THEATRE_ID = 0;
    this.CITY_ID = 0;
    this.SHOW_ID = 0;
    this.DRAMA_ID = [];
    this.shows = [];
    this.dramas = [];
    this.theater = [];
    this.endValue = null;
    this.startValue = null;
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.search(true);
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
    this.search();
  }

  importInExcel() {
    this.search(true, true);
  }
  exportexcel(): void {
    var arry1 = [];
    var obj1: any = new Object();
    if (this.transactionExcelList.length > 0) {
      for (var i = 0; i < this.transactionExcelList.length; i++) {
        obj1['Theatre Name'] = this.transactionExcelList[i]['THEATRE_NAME'];
        obj1['Show Name'] = this.transactionExcelList[i]['SHOW_NAME'];
        obj1['Booking ID'] = this.transactionExcelList[i]['BOOKING_ID'];
        obj1['Seat Numbers'] = this.transactionExcelList[i]['SEAT_NUMBERS'];

        obj1['Payment Date Time'] =
          this.transactionExcelList[i]['PAYMENT_DATE_TIME'];
        obj1['Payment Gateway ID'] =
          this.transactionExcelList[i]['PAYMENT_GATEWAY_ID'];
        obj1['Total Tickets'] = this.transactionExcelList[i]['TOTAL_TICKETS'];
        obj1['Total Amount'] = this.transactionExcelList[i]['TOTAL_AMOUNT'];
        obj1['Group layout name'] =
          this.transactionExcelList[i]['GROUP_LAYOUT_NAME'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.transactionExcelList.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Transaction Report"' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There Is No Data', '');
    }
  }

  DateChange(event: any) {
    this.startValue = this.datePipe.transform(event[0], 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(event[1], 'yyyy-MM-dd');
  }
}
