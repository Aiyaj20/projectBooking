import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { ExportService } from 'src/app/export.service';
// import { ExportService } from '../export.service';

@Component({
  selector: 'app-categogy-wise-report',
  templateUrl: './categogy-wise-report.component.html',
  styleUrls: ['./categogy-wise-report.component.css'],
})
export class CategogyWiseReportComponent implements OnInit {
  dataList1: any[] = [];

  isFilterApplied: any = 'default';
  isOk: boolean = false;
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
  query: any;

  type: any;
  exportbook = [];
  bookingsexcel: any[] = [];
  SHOW_DATE: Date[] = [];
  THEATRE_ID: any = 0;
  DRAMA_ID: any = [];
  LAYOUT_ID: any = [];
  layout: any = [];
  filterQuery = '';
  columns: string[][] = [
    ['THEATRE_NAME', 'Theater'],
    ['SHOW_NAME', 'Drama'],
    ['GROUP_LAYOUT_NAME', 'Group Layout Name'],
    ['SHOW_TIME', 'Show time'],
    ['AMOUNT', 'Amount'],
    ['TOTAL_SEATS', 'Total Seats'],
    ['RESERVED_SEATS', 'Researved Seats'],
    ['AVAILABLE_FOR_BOOKING', 'Available For Booking'],
    ['BOOKED_SEATS', 'Booked Seats'],
    ['SOLD_AMOUNT', 'Sold Amount'],
    ['AVAILABLE_SEATS', 'Available Seats'],
  ];
  shows: any = [];
  category: any;
  SHOW_ID = 0;
  dramas: any = [];
  cities: any = [];
  CITY_ID = 0;
  dateFormat = 'dd/MM/yyyy';
  selectedDate: any = [];
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
    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
    this.getCities();
    // this.selectedDate[0] = new Date();
    // this.selectedDate[1] = new Date();
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
  getGroupLayoutName() {
    this.api.getSeatLayoutMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.layout = data['data'];
        } else {
          this.message.error("Can't Load Group Layout Name", '');
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

  gettheatername(cityid: number) {
    this.getdramas(cityid);
    this.THEATRE_ID = 0;
    this.DRAMA_ID = [];
    this.SHOW_ID = 0;
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
    // this.DRAMA_ID=0;
    // this.DRAMA_ID=undefined;
    this.DRAMA_ID = null;
    // this.DRAMA_ID='';

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
      this.pageIndex = 1;
      this.pageSize = 10;
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
    this.filterQuery = '';
    // if (this.selectedDate != undefined && this.selectedDate != null) {
    //   this.startValue = this.datePipe.transform(
    //     this.selectedDate[0],
    //     'yyyy-MM-dd'
    //   );
    //   this.endValue = this.datePipe.transform(
    //     this.selectedDate[1],
    //     'yyyy-MM-dd'
    //   );

    //   this.filterQuery =
    //     " AND ( PAYMENT_DATE_TIME  BETWEEN '" +
    //     this.startValue +
    //     " 00:00:00' AND '" +
    //     this.endValue +
    //     " 23:59:59')";
    // }
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != null &&
      this.CITY_ID != 0
    ) {
      this.filterQuery += " AND (CITY_ID = '" + this.CITY_ID + "')";
    }
    if (
      this.THEATRE_ID != undefined &&
      this.THEATRE_ID != null &&
      this.THEATRE_ID != 0
    ) {
      this.filterQuery += " AND (THEATRE_ID = '" + this.THEATRE_ID + "')";
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
        .getcategory(
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
        .getcategory(
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

  applyFilter() {
   

    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = true;
    this.search(true);
  }

  clearFilter() {
    this.selectedDate = [];

    this.filterClass = 'filter-invisible';
    this.THEATRE_ID = 0;
    this.CITY_ID = 0;
    this.SHOW_ID = 0;
    this.DRAMA_ID = [];
    this.theater = [];
    this.dramas = [];
    this.shows = [];
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

    if (this.sortKey != sortField) {
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  importInExcel() {
    this.search(false, true);
  }
  exportexcel(): void {
    var arry1 = [];
    var obj1: any = new Object();

    if (this.exportbook.length > 0) {
      for (var i = 0; i < this.exportbook.length; i++) {
        // obj1['City Name'] = this.exportbook[i]['CITY_NAME'];
        obj1['Theatre Name'] = this.exportbook[i]['THEATRE_NAME'];
        obj1['Drama Name'] = this.exportbook[i]['DRAMA_NAME'];
        obj1['Group Layout Name'] = this.exportbook[i]['GROUP_LAYOUT_NAME'];
        // obj1['Show Time'] = this.exportbook[i]['SHOW_TIME'];
        if (
          this.exportbook[i]['SHOW_TIME'] != null ||
          this.exportbook[i]['SHOW_TIME'] != undefined ||
          this.exportbook[i]['SHOW_TIME'] != ''
        ) {
          obj1['Show Time'] = this.datePipe.transform(
            this.exportbook[i]['SHOW_TIME'],
            'dd-MM-yyyy HH:mm:ss'
          );
        } else {
        }
        obj1['Price(Rs.)'] = this.exportbook[i]['AMOUNT'];
        obj1['Total Tickets'] = this.exportbook[i]['TOTAL_SEATS'];
        obj1['Reserved Tickets'] = this.exportbook[i]['RESERVED_SEATS'];
        obj1['Available For Booking'] =
          this.exportbook[i]['AVAILABLE_FOR_BOOKING'];
        obj1['Sold Tickets'] = this.exportbook[i]['BOOKED_SEATS'];
        obj1['Sold Amount(Rs.)'] = this.exportbook[i]['SOLD_AMOUNT'];
        obj1['Remaining Tickets'] = this.exportbook[i]['AVAILABLE_SEATS'];
        arry1.push(Object.assign({}, obj1));
        if (i == this.exportbook.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Category Wise Report"' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There Is No Data', '');
    }
  }
}
