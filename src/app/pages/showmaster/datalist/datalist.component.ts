import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Master } from 'src/app/Models/Show Master';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SeatlayoutGroupNames } from 'src/app/Models/seatlayoutgroupname';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as moment from 'moment';
import { TheaterMasterr } from 'src/app/Models/theatermaster';
import { ExportService } from 'src/app/export.service';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css'],
})
export class DatalistComponent implements OnInit {
  showmasterid: any;
  drawerVisible = false;
  drawerTitle: any;
  pageSize = 10;
  pageIndex = 1;
  isOk: boolean = false;
  allMaster: any = [];
  // Products: any= []
  query: any;
  FROM_DATE: any;
  TO_DATE: any;
  Masterdetails: Master = new Master();
  interval: any;
  sortKey: string = 'id';
  sortValue: string = 'desc';
  searchText: any = '';
  loadingRecords = true;
  statuss: boolean = false;
  filterQuery: string = '';
  totalRecords: any;

  startValue: any;
  endValue: any;
  endOpen = false;
  startOpen = false;
  previewavail: any;
  filterClass: string = 'filter-invisible';
  isSpinning = false;
  isFilterApplied: any = 'default';
  isOngoingApplied: any = 'default';
  isUpcomingApplied: any = 'default';
  Alldatacoming: any = 'default';
  isCompletedApplied: any = 'default';
  today2 = new Date();
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();

  current = new Date();
  month = this.today;
  type: any;
  showStatus: string = '';
  THEATRE_ID = [];

  dataList: any[] = [];
  dataList1: any[] = [];

  columns: string[][] = [
    ['THEATRE_NAME', 'Theater_Name'],
    ['DISTIBUTOR_NAME', 'Distributor Name'],
    ['DRAMA_NAME', 'Drama_Name'],
    ['DATE', 'Date'],
    ['START_TIME', 'Stime'],
    ['END_TIME', 'Etime'],
    ['THEATRE_ADDRESS','Address'],
    ['BOOKING_STATUS', 'BOOKING_STATUS'],
    ['TOTAL_SEATS', 'Total_seats'],
    ['AVAILABLE_SEATS', 'Available_seats'],
    ['BOOKED_SEATS', 'Booked_seats'],
    ['TOTAL_REVENUE', 'Total_revenue'],
  ];
  layoutVisible: boolean = false;

  drawerOpen() {
    this.Masterdetails = new Master();
    this.cityId = [];
    this.detail = [];
    this.drawerVisible = true;
    this.drawerTitle = 'Create New Show';
  }

  drawerClose() {
    this.drawerVisible = false;
    this.search();
  }
  drawerClose2() {
    this.layoutVisible = false;
    this.search();
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }
  changeBoolean(s: any) {
    this.statuss = s;
  }

  get closeboolean() {
    return this.changeBoolean.bind(this);
  }
  theatreId: any;
  userId: any;

  ngOnInit(): void {
    this.theatreId = sessionStorage.getItem('theatreId');
    this.userId = Number(sessionStorage.getItem('userId'));
    // this.search(true);
    //  this.onGet();
    // this.clickevent('U');
    this.showStatus = 'S';
    this.showcolor2 = 1;
    // this.filterQuery = ' AND IS_ACTIVE=1';
    this.getDramaList();
    if (this.userId != 1) {
      this.theaterList();
    } else {
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
  }

  theaterList() {
    this.api
      .getTheatreMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND ID in (' + this.theatreId + ')'
      )
      .subscribe(
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
  importInExcel() {
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
  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.showexcel.length; i++) {
      obj1['Theater Name'] =
        this.showexcel[i]['THEATRE_NAME'] +
        ' ,' +
        this.showexcel[i]['CITY_NAME'];
      obj1['Distributor Name'] = this.showexcel[i]['DISTIBUTOR_NAME'];
      obj1['Drama Name'] = this.showexcel[i]['DRAMA_NAME'];
      obj1['Date'] = this.datePipe.transform(
        this.showexcel[i]['DATE'],
        'dd-MM-yyyy'
      );
      obj1['Start Time'] = this.convertTime(this.showexcel[i]['START_TIME']);
      obj1['End Time'] = this.showexcel[i]['END_TIME']
        ? this.convertTime(this.showexcel[i]['END_TIME'])
        : '';
      obj1['Booking Status'] = this.showexcel[i]['BOOKING_STATUS'];
      obj1['Total Seats'] = this.showexcel[i]['TOTAL_SEATS'];
      obj1['Available Seats'] = this.showexcel[i]['AVAILABLE_SEATS'];
      obj1['Booked Seats'] = this.showexcel[i]['BOOKED_SEATS'];
      obj1['Total Revenue (₹)'] = this.showexcel[i]['TOTAL_REVENUE'];

      // obj1['Birth Date'] = this.showexcel[i]['BIRTH_DATE'];


      
      arry1.push(Object.assign({}, obj1));
      if (i == this.showexcel.length - 1) {
        this._exportService.exportExcel(arry1, 'Showmaster');
      }
    }
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

  constructor(
    public api: ClientmasterService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private notify: NzNotificationService,
    private _exportService: ExportService
  ) {}

  onGet() {
    this.api
      .getmaster(this.pageIndex, this.pageSize, 'NAME', '', this.filterQuery)
      .subscribe((data: any) => {
        this.allMaster = data['data'];
      });
  }
  STATUS = '';
  enabled = 0;
  disabled = 0;
  ongoing = 0;
  stopped = 0;
  completed = 0;
  upcomming = 0;
  cancelled = 0;
  showcolor0 = 1;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 0;
  showcolor4 = 0;
  showcolor5 = 0;
  showcolor6 = 0;

  clickevent(data: any) {
    this.STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.filterQuery = '';
    
     if (
      this.startValue != undefined &&
      this.endValue != undefined 
    ) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
    }
    if (
  
      this.type != undefined 
    ) {
      this.isFilterApplied = 'primary';
      this.filterQuery += ' AND THEATRE_ID = ' + this.type;
      this.filterClass = 'filter-invisible';
    }
    if(this.DRAMA_ID){
      this.isFilterApplied = 'primary';
      this.filterQuery += ' AND DRAMA_ID = ' + this.DRAMA_ID;
      this.filterClass = 'filter-invisible';
    }
    if (data == 'A') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
      this.showcolor5 = 0;
      this.showcolor6 = 0;
      // this.filterQuery += ' AND IS_ACTIVE=1';
      this.showStatus = '';
    } else if (data == 'D') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
      this.showcolor5 = 0;
      this.showcolor6 = 0;
      // this.filterQuery += ' AND IS_ACTIVE=0';
      this.showStatus = '';
    } else if (data == 'S') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
      this.showcolor5 = 0;
      this.showcolor6 = 0;
      this.showStatus = data;
      // this.filterQuery += ' AND IS_ACTIVE=1';
    } else if (data == 'BS') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
      this.showcolor5 = 0;
      this.showcolor6 = 0;
      this.showStatus = data;
      // this.filterQuery += ' AND IS_ACTIVE=1';
    } else if (data == 'C') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 1;
      this.showcolor5 = 0;
      this.showcolor6 = 0;
      this.showStatus = data;
      // this.filterQuery += ' AND IS_ACTIVE=1';
    } else if (data == 'NSY') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
      this.showcolor5 = 1;
      this.showcolor6 = 0;
      this.showStatus = data;
      // this.filterQuery += ' AND IS_ACTIVE=1';
    } else if (data == 'SC') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
      this.showcolor5 = 0;
      this.showcolor6 = 1;
      this.showStatus = data;
      // this.filterQuery += ' AND IS_ACTIVE=1';
    }
    this.search();
  }
  cityId: any = [];
  detail: any = [];
  RateArray: any = [];
  distributorslist = [];
  DRAMA_ID: any;
  dramalist: any[] = [];
  getDramaList() {
    this.api
      .getdramaMaster(0, 0, 'id', 'desc', ' AND STATUS=1')
      .subscribe((datacode) => {
        if (datacode.code == 200) {
          this.dramalist = datacode['data'];
        } else {
          this.dramalist = [];
        }
      });
  }
  edit(data: Master) {
    let newArray = [];
    this.cityId = [];
    this.detail = [];

    this.drawerTitle = 'Update Show';
    this.Masterdetails = Object.assign({}, data);

    this.Masterdetails.START_TIME = this.Masterdetails.START_TIME
      ? new Date('01-01-1970 ' + this.Masterdetails?.START_TIME)
      : null;
    this.Masterdetails.END_TIME = this.Masterdetails.END_TIME
      ? new Date('01-01-1970 ' + this.Masterdetails?.END_TIME)
      : null;

    let RATE_ARRAY1 = data['RATE_ARRAY']
      ? JSON.parse(data['RATE_ARRAY'])
      : null;
    this.RateArray = RATE_ARRAY1;
    if (RATE_ARRAY1 && RATE_ARRAY1.length > 0) {
      for (let i = 0; i < RATE_ARRAY1.length; i++) {
        newArray.push({
          DEFAULT_RATE: RATE_ARRAY1[i]['AMOUNT'],
          LAYOUT_NAME: RATE_ARRAY1[i]['GROUP_LAYOUT_NAME'],
          LAYOUT_ID: RATE_ARRAY1[i]['LAYOUT_ID'],
        });
      }
      this.Masterdetails.TICKET_RATE = newArray;
    } else {
      this.Masterdetails.TICKET_RATE = [];
    }

    // this.Masterdetails .START_TIME=this.datePipe.transform(this.Masterdetails .START_TIME,"HH:mm:ss");
    // this.Masterdetails .END_TIME=this.datePipe.transform(this.Masterdetails .END_TIME,"HH:mm:ss");

    this.Masterdetails.START_TIME = this.Masterdetails.START_TIME
      ? new Date(this.Masterdetails.START_TIME)
      : null;
    this.Masterdetails.END_TIME = this.Masterdetails.END_TIME
      ? new Date(this.Masterdetails.END_TIME)
      : null;
    this.api
      .getdramaMaster(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1  AND ID =' + data.DRAMA_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;

            this.FROM_DATE = data['data'][0]['FROM_DATE'];
            this.TO_DATE = data['data'][0]['TO_DATE'];
          }
        },
        (err) => {
          console.log(err);
        }
      );

    this.api
      .getTheatreMaster(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1 AND ID =' + this.Masterdetails.THEATRE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            var theatreList = data['data'];
            if (theatreList.length > 0) {
              for (let i = 0; i < theatreList.length; i++) {
                this.cityId.push(theatreList[i]['CITY_ID']);
              }
            } else {
              this.cityId = 0;
            }
            this.detail = [];
            this.api
              .getdramaMaster(
                0,
                0,
                '',
                'asc',
                ' AND STATUS=1 AND CITY_ID in(' + this.cityId + ')'
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.loadingRecords = false;
                    this.detail = data['data'];
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
          }
        },
        (err) => {
          console.log(err);
        }
      );

      var theateridFilter = '';
    if (data.THEATRE_ID) {
      theateridFilter = ' AND THEATRE_ID = ' + data.THEATRE_ID;
    } else {
      theateridFilter = '';
    }
    this.api
      .userTheatreMapping(0, 0, '', 'asc', theateridFilter)
      .subscribe((data) => {
        if (data.code == 200) {
          if (data.count > 0) {
            this.distributorslist = data['data'];
          } else {
            this.distributorslist = [];
            // this.data.DISTIBUTOR_ID = undefined;
            // this.message.error('No Distributors Found','')
          }
        } else {
          this.message.error('Failed To Get Records', '');
        }
      });
    this.drawerVisible = true;
  }

  keyup(event: any) {
    this.search();
  }
  totalnumber = 0;

  array: any = [];
  extraFilter: any;
  search(reset: boolean = false, isExcelDownload: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.filterQuery=''
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
      if (
        this.theatreId != undefined ||
        this.theatreId != null ||
        this.theatreId != ''
      ) {
        this.extraFilter = ' AND THEATRE_ID in(' + this.theatreId + ')';
      } else {
        this.extraFilter = ' AND THEATRE_ID in(' + 0 + ')';
      }
    } else {
      this.extraFilter = '';
    }
    if(this.startValue != undefined && this.endValue != undefined) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
    }
    if (this.DRAMA_ID) {
      this.filterQuery += ' AND DRAMA_ID = ' + this.DRAMA_ID;
    }
    // if(this.showStatus!=''){
    //   this.filterQuery += " AND BOOKING_STATUS = '" + this.showStatus +"'";
    // }
    if(this.type!=null && this.type!=undefined){
      this.filterQuery += ' AND THEATRE_ID = ' + this.type;
    }
    var status = '';
    if (this.showStatus == 'BS') status = " and BOOKING_STATUS in ('BS')";
    else if (this.showStatus == 'S') status = " and BOOKING_STATUS in ('S')";
    else if (this.showStatus == 'C') status = " and BOOKING_STATUS in ('C')";
    else if (this.showStatus == 'NSY')
      status = " and BOOKING_STATUS in ('NSY')";
    else if (this.showStatus == 'SC') status = " and BOOKING_STATUS in ('SC')";

    var filter = '';
    if (likeQuery) filter = this.filterQuery + likeQuery;
    else filter = this.filterQuery;
    this.query = likeQuery;

    this.api
      .getmaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilter + this.filterQuery + likeQuery + status
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.allMaster = data['data'];
            let sum = 0;
            let sum1 = 0;
            let sum2 = 0;
            let sum3 = 0;
            for (let i = 0; i < this.allMaster.length; i++) {
              sum += this.allMaster[i]['BOOKED_SEATS'];
              sum1 += this.allMaster[i]['AVAILABLE_SEATS'];
              sum3 += this.allMaster[i]['TOTAL_SEATS'];
            }
            sum2 = sum + sum1 + sum3;
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
          var filter2=''
          if(this.startValue != undefined && this.endValue != undefined) {
            this.isFilterApplied = 'primary';
            filter2 =
              " AND DATE between '" +
              this.startValue +
              "' AND '" +
              this.endValue +
              "' ";
            this.filterClass = 'filter-invisible';
          }
          if (this.DRAMA_ID) {
            filter2 += ' AND DRAMA_ID = ' + this.DRAMA_ID;
          }
          if(this.type!=null && this.type!=undefined){
            filter2 += ' AND THEATRE_ID = ' + this.type;
          }
          this.api.getmasterscount(0, 0, '', '',   filter2 + likeQuery + this.extraFilter).subscribe((counts) => {
            if (counts.code == 200) {

              // this.enabled = counts['data'][0]['ACTIVE'];
              // this.disabled = counts['data'][0]['DISABLED'];
              this.ongoing = counts['data'][0]['ONGOING'];
              this.stopped = counts['data'][0]['STOPPED'];
              this.completed = counts['data'][0]['COMPLETED'];
              this.upcomming = counts['data'][0]['UPCOMING'];
              this.cancelled = counts['data'][0]['CANCELLED'];
            } else {
              // this.enabled = 0;
              // this.disabled = 0;
              this.ongoing = 0;
              this.stopped = 0;
              this.completed = 0;
              this.upcomming = 0;
              this.cancelled = 0;
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
    if (isExcelDownload) {
      this.api
        .getmaster(
          0,
          0,
          this.sortKey,
          sort,
          this.extraFilter + likeQuery + this.filterQuery + status
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.showexcel = data['data'];
              this.totalRecords = data['count'];
              this.convertInExcel();
              for (let i = 0; i < this.showexcel.length; i++) {
                this.showexcel[i].START_TIME = this.showexcel[i]?.START_TIME
                  ? this.datePipe.transform(
                      this.getTimeIn12Hour(this.showexcel[i]?.START_TIME),
                      'hh:mm a'
                    )
                  : null;
                this.showexcel[i].END_TIME = this.showexcel[i].END_TIME
                  ? this.datePipe.transform(
                      this.getTimeIn12Hour(this.showexcel[i]?.END_TIME),
                      'hh:mm a'
                    )
                  : null;
                this.showexcel[i].SHOW_DATE = this.showexcel[i]?.SHOW_DATE
                  ? this.datePipe.transform(
                      this.showexcel[i]?.SHOW_DATE,
                      'dd-MM-yyyy'
                    )
                  : null;
                if (this.showexcel[i]?.BOOKING_STATUS != undefined) {
                  if (this.showexcel[i]?.BOOKING_STATUS == 'BS') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Stopped';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'S') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Started';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'NSY') {
                    this.showexcel[i].BOOKING_STATUS =
                      'Booking Not Started Yet';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'BF') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Full';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'SC') {
                    this.showexcel[i].BOOKING_STATUS = 'Show Cancelled';
                  }
                }
              }
            }
            if (this.totalRecords > 0) {
              const element = window.document.getElementById('downloadExcel');
              if (element != null) element.click();
            } else {
              this.message.error('No Data', '');
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

  showlayoutDataList = [];
  ShowCountsdata: any = [];
  showlayoutVisible = false;
  ImageUrl: string = '';
  total = 0;
  tota1 = 0;
  total2 = 0;
  layout(data: SeatlayoutGroupNames): void {
    this.loadingRecords = true;
    this.showmasterid = data.ID;
    this.previewavail = data;
    // this.showlayoutVisible = true;
    this.api
      .getallshowseatbookingdetails(
        0,
        0,
        '',
        'asc',
        ' AND SHOW_ID =' + this.showmasterid
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.ShowCountsdata = data['summaryCounts'];
          this.showlayoutDataList = data['data'];
          this.api
            .getallshowseatbookingdetailsimage(
              0,
              0,
              '',
              'desc',
              ' AND SHOW_ID =' + this.showmasterid,
              this.showmasterid
            )
            .subscribe((data) => {
              if (data['code'] == 200) {
                this.ImageUrl = 'http://' + data['data']['layout_img'];
                this.showlayoutVisible = true;
                this.loadingRecords = false;
              } else {
                this.ImageUrl = '';
                this.loadingRecords = false;
              }
            });
        } else {
          this.ShowCountsdata = 0;
          this.loadingRecords = false;
          this.showlayoutDataList = [];
        }
      });
    // this.showlayoutVisible = true;
  }

  close(): void {
    this.showlayoutVisible = false;
    this.statuss = false;
    this.search();
  }
  get closeCallback1() {
    return this.close.bind(this);
  }
  isShowWiseLayout = true;
  //filter apply
  theaterId: any;
  layoutDataList: any = [];
  load: boolean = false;
  masterId: any;
  bookingStatus = '';
  layout2(data: TheaterMasterr): void {
    this.load = true;

    this.bookingStatus = data.BOOKING_STATUS;
    this.RateArray = data.RATE_ARRAY ? JSON.parse(data.RATE_ARRAY) : [];
    if (data.ID != undefined) {
      this.masterId = data.ID;
      this.theaterId = data.THEATRE_ID;
      this.api
        .getallTheatrelayout(
          0,
          0,
          '',
          'desc',
          ' AND THEATRE_ID =' + data.THEATRE_ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.layoutDataList = data['data'];
          }
        });
    } else {
    }
    this.layoutVisible = true;
  }

  close2(): void {
    this.layoutVisible = false;
  }
  dates: any = [];

  disabledEndDate2 = (current: Date): any => {
    let index = this.dates.findIndex(
      (date: any) => date === moment(current).format('YYYY-MM-DD')
    );
    return index === -1 && true;
  };

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

  timeDefaultValue = setHours(new Date(), 0);

  // disabledStartDate2 = (current: Date): boolean =>
  //   differenceInCalendarDays(current, this.today2) > 0;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }

  applyFilter() {
    this.filterQuery = '';
    this.isOk = true;
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    if (this.userId != 1) {
      if (
        this.theatreId != undefined ||
        this.theatreId != null ||
        this.theatreId != ''
      ) {
        this.extraFilter = ' AND CITY_ID in(' + this.theatreId + ')';
      } else {
        this.extraFilter = ' AND CITY_ID in(' + 0 + ')';
      }
    } else {
      this.extraFilter = '';
    }
    //////////////////////
     if (this.startValue == undefined && this.endValue != undefined) {
      this.notify.error('', 'Please Select Start Date');
      this.isOk=false
      this.filterClass='filter-visible'

    } else if (this.startValue != undefined && this.endValue == undefined) {
      this.notify.error('', 'Please Select End Date');
      this.isOk=false
      this.filterClass='filter-visible'

    } 
    //  else if
    else if(this.startValue != undefined && this.endValue != undefined) {
      this.isFilterApplied = 'primary';
      this.filterQuery =
        " AND DATE between '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";
      this.filterClass = 'filter-invisible';
    }
    if (this.DRAMA_ID) {
      this.filterQuery += ' AND DRAMA_ID = ' + this.DRAMA_ID;
    }
    if(this.showStatus!=''){
      this.filterQuery += " AND BOOKING_STATUS = '" + this.showStatus +"'";
    }
    if(this.type!=null && this.type!=undefined){
      this.filterQuery += ' AND THEATRE_ID = ' + this.type;
    }
    if (
      this.startValue == undefined &&
      this.endValue == undefined &&
      this.type == undefined &&
      this.DRAMA_ID == undefined
    ) {
      this.message.error('Please Select Filters', '');
      this.isOk = false;
      this.loadingRecords = false;
      this.isFilterApplied='default'
      this.filterClass='filter-visible'
    }
    //////////////////////
    var filter2 = '';
    // if (this.STATUS != '') {
    //   if (this.STATUS == 'A') {
    //     filter2 = ' AND IS_ACTIVE = 1';
    //   } else if (this.STATUS == 'D') {
    //     filter2 = ' AND IS_ACTIVE = 0';
    //   }
    // }
    this.filterQuery += filter2;
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    // if (
    //   this.startValue != undefined &&
    //   this.endValue != undefined &&
    //   this.type != undefined &&
    //   this.showStatus != ''
    // ) {
    //   this.isFilterApplied = 'primary';
    //   this.filterQuery =
    //     " AND DATE between '" +
    //     this.startValue +
    //     "' AND '" +
    //     this.endValue +
    //     "' " +
    //     ' AND THEATRE_ID=' +
    //     this.type +
    //     " AND SHOW_STATUS = '" + this.showStatus + "'";
    //   this.filterClass = 'filter-invisible';
    // } else
    //   if (
    //     this.startValue != undefined &&
    //     this.endValue != undefined &&
    //     this.type == undefined &&
    //     this.showStatus != ''
    //   ) {
    //     this.isFilterApplied = 'primary';
    //     this.filterQuery =
    //       " AND DATE between '" +
    //       this.startValue +
    //       "' AND '" +
    //       this.endValue +
    //       "' " +
    //       " AND SHOW_STATUS = '" + this.showStatus + "'";
    //     this.filterClass = 'filter-invisible';
    //   } else
    //     if (
    //       this.startValue != undefined &&
    //       this.endValue != undefined &&
    //       this.type != undefined &&
    //       this.showStatus == ''
    //     ) {
    //       this.isFilterApplied = 'primary';
    //       this.filterQuery =
    //         " AND DATE between '" +
    //         this.startValue +
    //         "' AND '" +
    //         this.endValue +
    //         "' " +
    //         ' AND THEATRE_ID=' +
    //         this.type;
    //       this.filterClass = 'filter-invisible';
    //     } else if (this.startValue != undefined && this.endValue != undefined) {
    //       this.isFilterApplied = 'primary';
    //       this.filterQuery =
    //         " AND DATE between '" +
    //         this.startValue +
    //         "' AND '" +
    //         this.endValue +
    //         "' ";
    //       this.filterClass = 'filter-invisible';
    //     } else if (
    //       this.type != undefined &&
    //       this.startValue == undefined &&
    //       this.endValue == undefined &&
    //       this.showStatus == ''
    //     ) {
    //       this.filterQuery = 'AND THEATRE_ID=' + '' + this.type;
    //       this.filterClass = 'filter-invisible';

    //     } else if (
    //       this.type == undefined &&
    //       this.startValue == undefined &&
    //       this.endValue == undefined &&
    //       this.showStatus != ''
    //     ) {
    //       this.filterQuery = " AND SHOW_STATUS = '" + this.showStatus + "'";
    //       this.filterClass = 'filter-invisible';

    //     } else if (this.startValue == undefined && this.endValue != undefined) {
    //       this.notify.error('', 'Please Enter Start Date');

    //     } else if (this.endValue == undefined && this.startValue != undefined) {
    //       this.notify.error('', 'Please Enter End Date');

    //     } else if (
    //       this.startValue != undefined &&
    //       this.type != undefined &&
    //       this.endValue == undefined &&
    //       this.showStatus != ''
    //     ) {
    //       this.notify.error('', 'Please Enter End Date');

    //     } else if (
    //       this.endValue != undefined &&
    //       this.type != undefined &&
    //       this.startValue == undefined
    //     ) {
    //       this.notify.error('', 'Please Enter Start Date');

    //     } else {
    //       this.notify.error('', 'Please Select Any Filter Value');
    //     }
    ///local
    if (this.isOk) {
      this.isFilterApplied='primary'
      this.filterClass='filter-invisible'
      this.api
        .getmaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.extraFilter + this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.dataList = data['data'];
            this.totalRecords = data['count'];
            this.allMaster = data['data'];
            var filter2=''
            if(this.startValue != undefined && this.endValue != undefined) {
              this.isFilterApplied = 'primary';
              filter2 =
                " AND DATE between '" +
                this.startValue +
                "' AND '" +
                this.endValue +
                "' ";
              this.filterClass = 'filter-invisible';
            }
            if (this.DRAMA_ID) {
              filter2 += ' AND DRAMA_ID = ' + this.DRAMA_ID;
            }
            if(this.type!=null && this.type!=undefined){
              filter2 += ' AND THEATRE_ID = ' + this.type;
            }
            this.api
              .getmasterscount(
                0,
                0,
                '',
                '',
                 filter2 + likeQuery
              )
              .subscribe((counts) => {
                if (counts.code == 200) {

                  // this.enabled = counts['data'][0]['ACTIVE'];
                  // this.disabled = counts['data'][0]['DISABLED'];
                  this.ongoing = counts['data'][0]['ONGOING'];
                  this.stopped = counts['data'][0]['STOPPED'];
                  this.completed = counts['data'][0]['COMPLETED'];
                  this.upcomming = counts['data'][0]['UPCOMING'];
                  this.cancelled = counts['data'][0]['CANCELLED'];
                } else {
                  // this.enabled = 0;
                  // this.disabled = 0;
                  this.ongoing = 0;
                  this.stopped = 0;
                  this.completed = 0;
                  this.upcomming = 0;
                  this.cancelled = 0;
                }
              });
          },
          (err) => {
            console.log(err);
          }
        );

      this.api
        .getmaster(0, 0, this.sortKey, sort, this.filterQuery + likeQuery)
        .subscribe(
          ///////publish
          // this.service.getAllContra(0,0,this.sortKey,sort,this.filterQuery + " AND TRANSACTION_TYPE_ID=2").subscribe(

          ///Live
          // this.service.getAllContra(0,0,this.sortKey,sort,this.filterQuery + " AND TRANSACTION_TYPE_ID=2").subscribe(

          (data) => {
            this.showexcel = data['data'];
            if(data['data']>0){
              for (let i = 0; i <= this.showexcel.length; i++) {
                this.showexcel[i].START_TIME = this.showexcel[i]?.START_TIME
                  ? this.datePipe.transform(
                      this.getTimeIn12Hour(this.showexcel[i]?.START_TIME),
                      'hh:mm a'
                    )
                  : '';
                this.showexcel[i].END_TIME = this.showexcel[i]?.END_TIME
                  ? this.datePipe.transform(
                      this.getTimeIn12Hour(this.showexcel[i]?.END_TIME),
                      'hh:mm a'
                    )
                  : '';
                this.showexcel[i].DATE = this.showexcel[i]?.DATE
                  ? this.datePipe.transform(this.showexcel[i]?.DATE, 'dd-MM-yyyy')
                  : '';
                if (this.showexcel[i]?.BOOKING_STATUS != undefined) {
                  if (this.showexcel[i]?.BOOKING_STATUS == 'BS') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Stopped';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'S') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Started';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'NSY') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Not Started Yet';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'BF') {
                    this.showexcel[i].BOOKING_STATUS = 'Booking Full';
                  } else if (this.showexcel[i]?.BOOKING_STATUS == 'SC') {
                    this.showexcel[i].BOOKING_STATUS = 'Show Cancelled';
                  }
                }
              }
            }
          
          },
          (err) => {
            console.log(err);
          }
        );
    }

    // this.filterClass='filter-invisible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.dataList = [];
    this.filterQuery = '';
    this.filterQuery = ' AND IS_ACTIVE=1';
    this.DRAMA_ID=null
    this.startValue = null;
    this.endValue = null;
    this.month = this.today;
    this.type = null;
    this.isFilterApplied = 'default';
    this.isCompletedApplied = 'default';
    this.isOngoingApplied = 'default';
    this.isUpcomingApplied = 'default';
    this.Alldatacoming = 'default';
    this.showStatus = '';
    // this.search();
    this.clickevent('S')
  }
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  showexcel: any[] = [];
  DownloadExcel() {
    this.isOk = true;
    this.isSpinning = true;
    // if (this.totalRecords == 0) {
    //   this.isOk = false;
    //   this.isSpinning = false;
    //   this.message.error('There is No Data Found..', '');
    // } else {
    //   this.api.getmaster(0, 0, '', '', this.query + this.filterQuery).subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.totalRecords = data['count'];
    //         this.showexcel = data['data'];

    //         for (let i = 0; i <= this.showexcel.length; i++) {
    //           if (
    //             this.showexcel[i]?.START_TIME != undefined &&
    //             this.showexcel[i]?.END_TIME != undefined
    //           ) {
    //             this.showexcel[i]['START_TIME'] = this.datePipe.transform(
    //               this.getTimeIn12Hour(this.showexcel[i]['START_TIME']),
    //               'HH:mm:a'
    //             );
    //             this.showexcel[i]['END_TIME'] = this.datePipe.transform(
    //               this.getTimeIn12Hour(this.showexcel[i]['END_TIME']),
    //               'HH:mm:a'
    //             );
    //             this.showexcel[i].DATE = this.datePipe.transform(
    //               this.showexcel[i]?.DATE,
    //               'dd-MM-yyyy'
    //             );
    //           }
    //           if (this.showexcel[i]?.BOOKING_STATUS != undefined) {
    //             if (this.showexcel[i]?.BOOKING_STATUS == 'BS') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Stopped';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'S') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Started';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'NSY') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Not Started Yet';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'BF') {
    //               this.showexcel[i].BOOKING_STATUS = 'Booking Full';
    //             } else if (this.showexcel[i]?.BOOKING_STATUS == 'SC') {
    //               this.showexcel[i].BOOKING_STATUS = 'Show Cancelled';
    //             }
    //           }
    //         }
    //         this.isSpinning = false;
    //         const element = window.document.getElementById('downloadExcel');
    //         if (element != null) element.click();
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // }
    this.search(false, true);
  }

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.startValue) < 0;

  onGoingShow(event: any) {
    // this.clearFilter();
    this.dataList = [];
    this.showStatus = 'O';
    this.isFilterApplied = 'primary';
    this.isOngoingApplied = 'primary';
    this.isUpcomingApplied = 'default';
    this.Alldatacoming = 'default';
    this.isCompletedApplied = 'default';

    this.startValue = null;
    this.endValue = null;
    this.type = null;
    // if (
    //   this.startValue != undefined &&
    //   this.endValue != undefined &&
    //   this.type != undefined
    // ) {
    //   this.startValue == undefined;
    //   this.endValue == undefined;
    //   this.type == undefined;
    // } else if (this.startValue != undefined && this.endValue != undefined) {
    //   this.startValue == undefined;
    //   this.endValue == undefined;
    // } else if (this.startValue != undefined) {
    //   this.startValue == undefined;
    // } else if (this.endValue != undefined) {
    //   this.endValue == undefined;
    // } else if (this.type != undefined) {
    //   this.type == undefined;
    // } else {
    // }

    this.applyFilter();
    // this.search();
  }
  upcomingShow(event: any) {
    // this.clearFilter();
    this.dataList = [];
    this.showStatus = 'U';
    this.isFilterApplied = 'primary';
    this.isOngoingApplied = 'default';
    this.isUpcomingApplied = 'primary';
    this.isCompletedApplied = 'default';
    this.Alldatacoming = 'default';
    this.startValue = null;
    this.endValue = null;
    this.type = null;
    // if (
    //   this.startValue != undefined ||
    //   this.endValue != undefined ||
    //   this.type != undefined
    // ) {
    //   this.startValue == undefined;
    //   this.endValue == undefined;
    //   this.type == undefined;
    // } else {
    // }
    this.applyFilter();
    // this.search();
  }
  completeShow(event: any) {
    this.dataList = [];
    // this.clearFilter();
    this.isFilterApplied = 'primary';
    this.isCompletedApplied = 'primary';
    this.isUpcomingApplied = 'default';
    this.Alldatacoming = 'default';
    this.isOngoingApplied = 'default';
    this.showStatus = 'C';
    this.startValue = null;
    this.endValue = null;
    this.type = null;
    // if (
    //   this.startValue != undefined ||
    //   this.endValue != undefined ||
    //   this.type != undefined
    // ) {
    //   this.startValue == undefined;
    //   this.endValue == undefined;
    //   this.type == undefined;
    // } else {
    // }
    this.applyFilter();
    // this.search();
  }
  alldata(event: any) {
    this.isFilterApplied = 'primary';
    this.isCompletedApplied = 'default';
    this.isUpcomingApplied = 'default';
    this.Alldatacoming = 'primary';
    this.isOngoingApplied = 'default';

    this.type = null;
    this.api
      .getmaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        '',
        this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.allMaster = data['data'];
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
