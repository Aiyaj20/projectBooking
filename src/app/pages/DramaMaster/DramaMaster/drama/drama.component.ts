import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DramaMAsterr } from 'src/app/Models/daramamaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays } from 'date-fns';
import { TheaterMasterr } from 'src/app/Models/theatermaster';
@Component({
  selector: 'app-drama',
  templateUrl: './drama.component.html',
  styleUrls: ['./drama.component.css'],
})
export class DramaComponent implements OnInit {
  isFilterApplied: any = 'default';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: DramaMAsterr = new DramaMAsterr();
  formTitle = 'Manage Dramas';
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
    ['CITY_NAME', ' City Name'],
    ['NAME', 'Drama Name'],
    ['CAST_NAMES', 'Cast Names'],
    ['DESCRIPTION', 'Description'],
    ['FROM_DATE', 'From Date'],
    ['TO_DATE', 'To Date'],
    ['SEQUENCE_NUMBER', 'Sequence No'],
    ['STATUS', 'Status'],
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
    this.clickevent('A')
    this.getCities();

    if (this.userId != 1) {
      this.theaterList();
    } else {
    }
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
  clickevent(data: any) {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.filterQuery=''
    if(this.FROM_DATE && this.TO_DATE){
      this.filterQuery =
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
    if(this.cityid!=undefined && this.cityid!=null){
      this.filterQuery+=' AND CITY_ID = '+this.cityid
    }
    if (data == 'A') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.filterQuery += ' AND STATUS=1';
    } else if (data == 'D') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.filterQuery += ' AND STATUS=0';
    }
    this.search();
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

    this.api
      .getdramaMaster(
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
            this.dataList = data['data'];
            var filter2=''
            if(this.cityid){
              filter2=' AND CITY_ID = '+this.cityid
            }
            if(this.FROM_DATE && this.TO_DATE){
              filter2+=
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
            this.api.getDramaCounts(0,0,'','',filter2 + likeQuery + this.extraFilter).subscribe(counts=>{
              if(counts.code==200){
                // console.log(counts['data'])
                this.enabled=counts['data'][0]['ACTIVE']
                this.disabled=counts['data'][0]['DISABLED']
              }
              else{
                this.enabled=0
                this.disabled=0
              }
            })
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
    this.api
      .getdramaMaster(
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
            this.totalRecords = data['count'];
            this.listOfData1 = data['data'];
            for (let i = 0; i < this.listOfData1.length; i++) {
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
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.InupuDisabled = false;

    this.drawerTitle = 'Create New Drama';
    this.drawerData = new DramaMAsterr();
    this.api.getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NUMBER = 1;
        } else {
          this.drawerData.SEQUENCE_NUMBER =
            data['data'][0]['SEQUENCE_NUMBER'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerVisible = true;
  }

  CAST_NAMES: any;
  height: any;
  width: any;
  InupuDisabled: boolean = false;

  edit(data: DramaMAsterr): void {
    
    this.InupuDisabled = false;
    this.drawerTitle = 'Update Drama';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    if (this.drawerData.CAST_NAMES == '') {
      this.drawerData.CAST_NAMES = [];
    } else {
      this.drawerData.CAST_NAMES = this.drawerData.CAST_NAMES.split(',');
    }
    
  }
  
  addnew(data: DramaMAsterr): void {
    
    this.drawerTitle = 'Add New Drama';
    this.drawerData = new DramaMAsterr();
    this.drawerData.NAME = data.NAME;
    
    this.drawerData.DESCRIPTION = data.DESCRIPTION;
    this.drawerData.SHORT_CODE = data.SHORT_CODE;
    this.drawerData.DRAMA_IMAGE = data.DRAMA_IMAGE;
    if (data.CAST_NAMES == '') {
      this.drawerData.CAST_NAMES = [];
    } else {
      this.drawerData.CAST_NAMES = data.CAST_NAMES.split(',');
      

    }
    this.InupuDisabled = true;

    this.drawerVisible = true;
    this.api.getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NUMBER = 1;
        } else {
          this.drawerData.SEQUENCE_NUMBER =
            data['data'][0]['SEQUENCE_NUMBER'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

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
    this.filterQuery=''
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
      this.isOk=true
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
      this.isOk=false
      this.loadingRecords = false;
    } else if (this.TO_DATE == undefined && this.FROM_DATE != undefined) {
      this.message.error('', 'Please Select End Date');
      this.isOk=false
      this.loadingRecords = false;
    } 
    else if (this.FROM_DATE == undefined && this.TO_DATE == undefined && this.cityid==undefined) {
      this.message.error('', 'Please Selects Filters');
      this.loadingRecords = false;
      this.isOk=false

    } 
    else{
      this.isOk=true
    }
    // else if (this.FROM_DATE == undefined && this.TO_DATE == undefined && this.cityid==undefined) {
    //   this.message.error('', 'Please Selects Dates');
    //   this.loadingRecords = false;
    //   this.isOk=false

    // } 
    if(this.cityid!=undefined && this.cityid!=null){
      this.filterQuery+=' AND CITY_ID = '+this.cityid
    }
    if(this.showcolor0==1){
      this.filterQuery+= ' AND STATUS=1'
    }
    if(this.showcolor1==1){
      this.filterQuery+= ' AND STATUS=0'
    }
    if(this.isOk) {
      // this.filterQuery = ' ';
      this.filterClass = 'filter-invisible';
      this.search();
    }

    ///local
    // this.api
    //   .getdramaMaster(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     sort,
    //     this.extraFilter+this.filterQuery
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.loadingRecords = false;
    //       this.dataList = data['data'];
    //       this.totalRecords = data['count'];
    //       this.DramaMAsterr = data['data'];
    //       // this.listOfData1 = data['data'];

    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // this.filterClass='filter-invisible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.FROM_DATE = null;
    this.TO_DATE = null;
    this.selectedDate = [];
    this.cityid=null
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.clickevent('A')
    this.listOfData = [];
    // this.search();
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
      this.api.getdramaMaster(0, 0, '', '', this.filterQuery + this.extraFilter).subscribe(
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
}
