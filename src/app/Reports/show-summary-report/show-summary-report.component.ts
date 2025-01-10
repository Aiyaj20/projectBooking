import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { ExportService } from 'src/app/export.service';

@Component({
  selector: 'app-show-summary-report',
  templateUrl: './show-summary-report.component.html',
  styleUrls: ['./show-summary-report.component.css'],
})
export class ShowSummaryReportComponent implements OnInit {
  table: any = [];
  totalRecords: any;
  pageSize = 10;
  pageIndex = 1;
  loadingRecords = false;

  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  searchText: any = '';
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-1';

  current = new Date();
  month = this.today;
  // filterQuery: string = '';
  sortKey: string = '';
  sortValue: string = '';
  query: any;
  columns: string[][] = [
    ['THEATRE_NAME', ' theater name'],
    ['SHOW_NAME', 'drama name'],
    ['SHOW_STATUS', 'Show Status'],
    ['SHOW_DATE', 'date'],
    ['TOTAL_SEATS', 'total seats'],
    // ['BOOKED_SEATS', 'researved seats'],
    // ['COLLECTED_AMOUNT', 'Collected Amount'],
  ];

  selectedDate: Date[] = [];
  endOpen = false;
  THEATRE_ID: any = [];
  DataList: any = [];
  Master: any = [];
  CityData: any;
  DRAMA_ID: any = [];
  SHOW_STATUS: any;
  CITY_ID: any = [];
  Spinning = false;
  data: any = [];
  dateFormat = 'dd/MM/yyyy';

  bookingsexcel: any[] = [];
  exportbook = [];
  filterQuery = '';
  userId: any;
  theatreId: any;
  extraFilter: any;
  // filterQuery= "AND DATE(SHOW_DATE) = '"+ this.month+"'";
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private exportService: ExportService
  ) {}
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    var date = new Date();
    this.selectedDate[0] = new Date(date.getFullYear(), date.getMonth(), 1);
    this.selectedDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.api.getCityMaster(0, 0, '', '', 'AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CityData = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
    // this.applyFilter();
  }

  gettheatername(cityid: number) {
    this.THEATRE_ID = [];
    this.DRAMA_ID = [];
    this.SHOW_STATUS = [];

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
            this.DataList = data['data'];
          } else {
            this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  theaterList() {
    this.api
      .getTheatreMaster(0, 0, '', '', ' AND ID in(' + this.theatreId + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DataList = data['data'];
          } else {
            this.message.error("Can't Load Theater Name", '');
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
            this.Master = data['data'];
          } else {
            this.message.error("Can't Load Drama Name", '');
          }
        },

        (err) => {
          console.log(err);
        }
      );
  }
  cityIDS: any = [];
  a(event: any) {
    this.api.getTheatreMaster(0, 0, '', '', ' AND ID = ' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Master = [];
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
                  this.Master = data['data'];
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
  keyup(event: any) {
    this.search();
  }

  KeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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
    this.search(true, false);
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'THEATRE_ID';
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
    if (this.selectedDate != undefined && this.selectedDate != null) {
      this.startValue = this.datePipe.transform(
        this.selectedDate[0],
        'yyyy-MM-dd'
      );
      this.endValue = this.datePipe.transform(
        this.selectedDate[1],
        'yyyy-MM-dd'
      );

      this.filterQuery =
        " AND (SHOW_DATE BETWEEN '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "')";
      this.isFilterApplied = 'primary';
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
      this.DRAMA_ID != undefined &&
      this.DRAMA_ID != null &&
      this.DRAMA_ID.length > 0
    ) {
      this.filterQuery += ' AND DRAMA_ID in (' + this.DRAMA_ID + ')';
    }
    if (
      this.SHOW_STATUS != undefined &&
      this.SHOW_STATUS != null &&
      this.SHOW_STATUS != 0
    ) {
      this.filterQuery += " AND (SHOW_STATUS = '" + this.SHOW_STATUS + "')";
    }
    if (exportInExcel == true) {
      this.api
        .getShowSummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          this.extraFilter + likeQuery + this.filterQuery + " AND IS_ACTIVE=1"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.exportbook = data['data'];

              this.DownloadExcelFile();
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (!exportInExcel) {

      this.api
        .getShowSummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.extraFilter + likeQuery + this.filterQuery + " AND IS_ACTIVE=1"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.table = data['data'];
              // this.DownloadExcel()
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
  }

  StartDate(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }
  startValue: any;
  endValue: any;
  applyFilter() {
    // this.filterQuery = '';
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
    //     " AND (SHOW_DATE BETWEEN '" +
    //     this.startValue +
    //     "' AND '" +
    //     this.endValue +
    //     "')";
    // }
   

    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = true;
    this.search(true, false);
  }

  DownloadExcel(): void {
    this.search(true, true);
  }

  DownloadExcelFile(): void {
    const excelData = [];
    if (this.exportbook.length > 0) {
      for (let i = 0; i < this.exportbook.length; i++) {
        const obj1: any = {};
        obj1['Theatre Name'] = this.exportbook[i]['THEATRE_NAME'];
        obj1['Show Name'] = this.exportbook[i]['SHOW_NAME'];

        if (this.exportbook[i]['SHOW_STATUS'] == 'S') {
          obj1['Booking Status'] = 'Booking Started';
        } else if (this.exportbook[i]['SHOW_STATUS'] == 'NSY') {
          obj1['Booking Status'] = 'Booking Not Started Yet';
        } else if (this.exportbook[i]['SHOW_STATUS'] == 'BF') {
          obj1['Booking Status'] = 'Booking Full';
        } else if (this.exportbook[i]['SHOW_STATUS'] == 'SC') {
          obj1['Booking Status'] = 'Show Cancelled';
        } else {
          obj1['Booking Status'] = 'Booking Stopped';
        }

        obj1['Show Name'] = this.exportbook[i]['DRAMA_NAME'];
        obj1['Show Date'] = this.exportbook[i]['SHOW_DATE'];
        obj1['Total Tickets'] = this.exportbook[i]['TOTAL_SEATS'];
        obj1['Total Transactions'] = this.exportbook[i]['BOOKED_SEATS'];
        obj1['Collected Amount(Rs.)'] = this.exportbook[i]['COLLECTED_AMOUNT'];
        excelData.push(Object.assign({}, obj1));
        if (i == this.exportbook.length - 1) {
          this.exportService.exportExcel(
            excelData,
            'Show Summary Report"' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There Is No Data', '');
    }
  }

  // clearFilter() {
  //   this.selectedDate = [];
  //   this.showID = null;
  //   this.TheatreID = null;
  //   this.filterQuery = '';
  //   this.startValue =null
  //   this.endValue =null
  //   this.filterClass = 'filter-invisible';
  //   this.isFilterApplied = 'default';
  //   this.search();

  //   this.filterClass = 'filter-invisible';
  // }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.CITY_ID = 0;
    this.DataList = [];
    this.Master = [];
    this.DRAMA_ID = [];
    this.SHOW_STATUS = [];
    var date = new Date();
    this.selectedDate[0] = new Date(date.getFullYear(), date.getMonth(), 1);
    this.selectedDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.endValue = null;
    this.startValue = null;
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.search(true);
  }
}
