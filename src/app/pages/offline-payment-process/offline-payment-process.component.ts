import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DramaMAsterr } from 'src/app/Models/daramamaster';
import { TheaterMasterr } from 'src/app/Models/theatermaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays } from 'date-fns';
@Component({
  selector: 'app-offline-payment-process',
  templateUrl: './offline-payment-process.component.html',
  styleUrls: ['./offline-payment-process.component.css'],
})
export class OfflinePaymentProcessComponent implements OnInit {
  isFilterApplied: any = 'default';
  drawerTitle!: string;
  drawerData: any;
  formTitle = 'Manage Offline Bookings';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  enabled = 0;
  disabled = 0;
  showcolor0 = 1;
  showcolor1 = 0;
  isOk: boolean = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  value1: any;
  value2: any;
  isSpinning = false;
  listOfData: DramaMAsterr[] = [];
  listOfData1: any[] = [];
  current = new Date();
  startValue: any;
  endValue: any;
  selectedDate: Date[] = [];
  dates: any = [];

  filterClass: any = 'filter-invisible';
  // isSpinning=false;
  // isFilterApplied:any='default'
  today2 = new Date();
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();
  // current = new Date();
  month = this.today;
  type: any;
  CITY_ID = [];

  dataList1: any[] = [];
  endOpen = false;
  startOpen = false;
  FROM_DATE: any;
  TO_DATE: any;
  list: any = [];
  DramaMAsterr: any = [];
  Dramalistexcel: any = [];
  cityid: any;
  cities: any[] = [];
  columns: string[][] = [
    ['MOBILE_NO', ' Mobile Number'],
    ['CITY_NAME', 'City Name'],
    ['THEATRE_NAME', 'Theatre Name'],
    ['SHOW_NAME', 'Show Name'],
    ['SEAT_NUMBERS', 'Seat Number'],
    ['CART_ID', 'Cart ID'],
    ['SHOW_DATE', 'Show Date'],
  ];
  imgUrl: any;
  userId: any;
  theatreId: any;
  // filterClass: string = 'filter-invisible';
  constructor(
    private api: ClientmasterService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    // this.clickevent('A');
    this.getCities();

    // if (this.userId != 1) {
    //   this.theaterList();
    // } else {
    // }
  }
  getCities() {
    this.api
      .getCityMaster(0, 0, 'id', 'desc', ' AND STATUS=1')
      .subscribe((citydata) => {
        if (citydata.code == 200) {
          this.cities = citydata['data'];
        } else {
          this.cities = [];
        }
      });
  }

  
  theater: any;
  cityId: any = [];
  theaterList() {
    this.api
      .getTheatreMaster(0, 0, '', '', ' AND ID in(' + this.theatreId + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.theater = data['data'];
            if (data['data'].length > 0) {
              for (let i = 0; i < this.theater.length; i++) {
                this.cityId.push(this.theater[i]['CITY_ID']);
              }
            } else {
              this.cityId = [];
            }

            this.citywiseshowreports();
          } else {
            this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  city: TheaterMasterr[] = [];
  citywiseshowreports() {
    if (this.cityId.length > 0) {
      this.api
        .getCityMaster(0, 0, '', '', ' AND ID in(' + this.cityId + ')')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.city = data['data'];
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.api.getCityMaster(0, 0, '', '', ' AND ID in(' + 0 + ')').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.city = data['data'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  keyup(event: any) {
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    // if (this.userId != 1) {
    //   if (
    //     this.theatreId != undefined ||
    //     this.theatreId != null ||
    //     this.theatreId != ''
    //   ) {
    //     this.extraFilter = ' AND CITY_ID in(' + this.theatreId + ')';
    //   } else {
    //     this.extraFilter = ' AND CITY_ID in(' + 0 + ')';
    //   }
    // } else {
    //   this.extraFilter = '';
    // }

    this.api
      .getOfflineBookingData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        " AND PAYMENT_MODE = 'C' AND BOOKING_STATUS = 'B'  AND ADMIN_CONFIRMATION_STATUS = 'P'" +
          likeQuery +
          this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            var filter2 = '';
            if (this.cityid) {
              filter2 = ' AND CITY_ID = ' + this.cityid;
            }
            if (this.FROM_DATE && this.TO_DATE) {
              filter2 +=
                " AND ( FROM_DATE between '" +
                this.FROM_DATE +
                ':00:00:00' +
                "' AND '" +
                this.TO_DATE +
                ':23:59:59' +
                "' " +
                "OR  TO_DATE between '" +
                this.FROM_DATE +
                ':00:00:00' +
                "' AND '" +
                this.TO_DATE +
                ':23:59:59' +
                "' )";
            }
            // this.api
            //   .getDramaCounts(
            //     0,
            //     0,
            //     '',
            //     '',
            //     filter2 + likeQuery + this.extraFilter
            //   )
            //   .subscribe((counts) => {
            //     if (counts.code == 200) {

            //       this.enabled = counts['data'][0]['ACTIVE'];
            //       this.disabled = counts['data'][0]['DISABLED'];
            //     } else {
            //       this.enabled = 0;
            //       this.disabled = 0;
            //     }
            //   });
            // if(this.totalRecords==0){
            //   data.SEQUENCE_NO=1;
            // }
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    // this.api
    //   .getOfflineBookingData(
    //     0,
    //     0,
    //     this.sortKey,
    //     '',
    //     this.extraFilter + likeQuery + this.filterQuery
    //   )
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.loadingRecords = false;
    //         this.totalRecords = data['count'];
    //         this.listOfData1 = data['data'];
    //         for (let i = 0; i < this.listOfData1.length; i++) {
    //           this.listOfData1[i].FROM_DATE = this.datePipe.transform(
    //             this.listOfData1[i]?.FROM_DATE,
    //             'dd-MM-yyyy'
    //           );
    //           this.listOfData1[i].TO_DATE = this.datePipe.transform(
    //             this.listOfData1[i]?.TO_DATE,
    //             'dd-MM-yyyy'
    //           );
    //         }
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  CAST_NAMES: any;
  height: any;
  width: any;
  InupuDisabled: boolean = false;

  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.loadingRecords = true;

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
  getTimeIn12Hour(time: any) {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }

  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  applyFilter() {
    this.filterQuery = '';
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.FROM_DATE = this.datePipe.transform(this.FROM_DATE, 'yyyy-MM-dd');
    this.TO_DATE = this.datePipe.transform(this.TO_DATE, 'yyyy-MM-dd');

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

    if (this.FROM_DATE != undefined && this.TO_DATE != undefined) {
      ////////////////////////////////////////////////////////////////
      this.isFilterApplied = 'primary';

      this.filterQuery =
        " AND ( SHOW_DATE between '" +
        this.datePipe.transform(this.FROM_DATE, 'yyyy-MM-dd') +
        ':00:00:00' +
        "' AND '" +
        this.datePipe.transform(this.TO_DATE, 'yyyy-MM-dd') +
        ':23:59:59' +
        "') ";
      
      this.isOk = true;
      this.filterClass = 'filter-invisible';
    }
    // else if (
    //   this.type != undefined &&
    //   this.FROM_DATE == undefined &&
    //   this.TO_DATE == undefined
    // ) {
    //   this.filterClass = 'filter-invisible';
    // }
    else if (this.FROM_DATE == undefined && this.TO_DATE != undefined) {
      this.message.error('', 'Please Select Start Date');
      this.isOk = false;
      this.loadingRecords = false;
    } else if (this.TO_DATE == undefined && this.FROM_DATE != undefined) {
      this.message.error('', 'Please Select End Date');
      this.isOk = false;
      this.loadingRecords = false;
    } else if (
      this.FROM_DATE == undefined &&
      this.TO_DATE == undefined &&
      this.cityid == undefined
    ) {
      this.message.error('', 'Please Selects Filters');
      this.loadingRecords = false;
      this.isOk = false;
    } else {
      this.isOk = true;
    }
    // else if (this.FROM_DATE == undefined && this.TO_DATE == undefined && this.cityid==undefined) {
    //   this.message.error('', 'Please Selects Dates');
    //   this.loadingRecords = false;
    //   this.isOk=false

    // }
    if (this.cityid != undefined && this.cityid != null) {
      this.filterQuery += ' AND CITY_ID = ' + this.cityid;
      this.isFilterApplied = 'primary';
    }
    // if (this.showcolor0 == 1) {
    //   this.filterQuery += ' AND STATUS=1';
    // }
    // if (this.showcolor1 == 1) {
    //   this.filterQuery += ' AND STATUS=0';
    // }
    if (this.isOk) {
      // this.filterQuery = ' ';
      this.filterClass = 'filter-invisible';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.FROM_DATE = null;
    this.TO_DATE = null;
    this.selectedDate = [];
    this.cityid = null;
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    
    this.listOfData = [];
    this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  disabledDate = (selected: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(selected, this.current) > 0;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;
    }
  }

  startDateChange() {
    var startDate = this.datePipe.transform(this.FROM_DATE, 'yyyy-MM-dd');
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

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
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
        .getOfflineBookingData(
          0,
          0,
          '',
          '',
          " AND PAYMENT_MODE = 'C' AND BOOKING_STATUS = 'B'  AND ADMIN_CONFIRMATION_STATUS = 'P'" +
            this.filterQuery +
            this.extraFilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.listOfData1 = data['data'];
              for (let i = 0; i <= this.listOfData1.length; i++) {
                if (
                  this.listOfData1[i]?.FROM_DATE != undefined &&
                  this.listOfData1[i]?.TO_DATE != undefined
                ) {
                  this.listOfData1[i].FROM_DATE = this.datePipe.transform(
                    this.listOfData1[i]?.FROM_DATE,
                    'dd-MM-yyyy'
                  );
                  this.listOfData1[i].TO_DATE = this.datePipe.transform(
                    this.listOfData1[i]?.TO_DATE,
                    'dd-MM-yyyy'
                  );
                }
              }

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

  paymentProcssDetails: any;
  paymentProcess(data: any) {
    this.paymentProcssDetails = '';
    this.paymentProcssDetails = data;
    this.isModalVisible = true;
  }

  isModalVisible: boolean = false;
  isOkLoading = false;
  loadmodal = false;
  BOOKING_STATUS: any;
  handleCancel(): void {
    this.isModalVisible = false;
    this.search();
  }

  handleOk(): void {
    setTimeout(() => {
      this.isModalVisible = false;
    }, 3000);
  }

  // showConfirm(): void {
  //   this.confirmModal = this.modal.confirm({
  //     nzTitle: 'Do you Want to delete these items?',
  //     nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
  //     nzOnOk: () =>
  //       new Promise((resolve, reject) => {
  //         setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
  //       }).catch(() => console.log('Oops errors!'))
  //   });
  // }

  confirmBooking(data: any) {
    if (this.paymentProcssDetails.BOOKING_STATUS) {
      var updateData = {
        CART_ID: data.ID,
        // STATUS: this.paymentProcssDetails.BOOKING_STATUS,
      };
      this.loadmodal = true;
      this.api.confirmOfflineBooking(updateData).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Updated Successfully', '');
          // if (!addNew) this.drawerClose();
          this.loadmodal = false;
          this.isModalVisible = false;
          this.search();
        } else {
          this.message.error('Information Not Updated', '');
          this.loadmodal = false;
        }
      });
    } else {
      this.message.error('Please Select The Status', '');
    }
  }

  cancel() {
    this.search();
  }
}
