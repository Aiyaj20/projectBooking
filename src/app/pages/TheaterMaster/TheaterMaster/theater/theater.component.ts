import { Component, OnInit } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TheaterMasterr } from 'src/app/Models/theatermaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css'],
})
export class TheaterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerVisible1!: boolean;
  enabled = 0;
  disabled = 0;
  showcolor0 = 1;
  showcolor1 = 0;
  drawerTitle!: string;
  drawerData: TheaterMasterr = new TheaterMasterr();
  formTitle = 'Manage Theaters';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: NzButtonType = 'default';
  datacount: any;
  filterClass: any = 'filter-invisible';
  isSpinning = false;
  listOfData1: any[] = [];
  cities: any[] = [];
  columns: string[][] = [
    ['CITY_NAME', ' City Name'],
    ['NAME', ' Theater Name'],
    ['ADDRESS', 'Theater Address'],
    ['LONGITUDE  ', ' Longitude '],
    ['LATITUDE', ' Latitude'],
    ['SEQUENCE_NUMBER', 'Sequence No'],
    ['STATUS', 'status'],
  ];
  userId: any;
  theatreId: any;
  city: TheaterMasterr[] = [];
  cityid: any;
  constructor(
    private api: ClientmasterService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    this.clickevent('A');
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
  theater: any = [];
  cityId: any = [];
  theaterList() {
    if (this.theatreId.length > 0) {
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
    } else {
      this.theater = [];
    }
  }
  STATUS = 1;
  clickevent(data: any) {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.filterQuery = '';
    if (this.cityid != undefined || this.cityid != null) {
      this.filterQuery = ' AND CITY_ID = ' + this.cityid;
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
    // this.loadingRecords = true;
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
        this.extraFilter = ' AND ID in(' + this.theatreId + ')';
      } else {
        this.extraFilter = ' AND ID in(' + 0 + ')';
      }
    } else {
      this.extraFilter = '';
    }

    this.api
      .getTheatreMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilter + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.listOfData1 = data['data'];
          if (this.totalRecords == 0) {
            data.SEQUENCE_NUMBER = 1;
          } else {
            data.SEQUENCE_NUMBER =
              this.dataList[this.dataList.length - 1]['SEQUENCE_NUMBER'] + 1;
          }
          var filter2=''
          if(this.cityid){
            filter2=' AND CITY_ID = '+this.cityid
          }
          this.api.getTheatreCounts(0, 0, '', '', filter2 + likeQuery + this.extraFilter).subscribe((counts) => {
            if (counts.code == 200) {

              this.enabled = counts['data'][0]['ACTIVE'];
              this.disabled = counts['data'][0]['DISABLED'];
            } else {
              this.enabled = 0;
              this.disabled = 0;
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.close.bind(this);
  }

  get closeCallback1() {
    return this.close1.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Theater';
    this.drawerData = new TheaterMasterr();
    this.drawerData.STATUS = true;
    this.api.getTheatreMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(
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

  url: any;
  pdfurl = '';
  imgUrl = appkeys.retriveimgUrl;
  edit(data: TheaterMasterr): void {
    this.drawerTitle = 'Update Theater';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.url = appkeys.retriveimgUrl + '';
    this.pdfurl =
      this.imgUrl + 'actualTheatreLayoutImage/' + data.ACTUAL_LAYOUT_IMAGE;
  }

  theaterId: any;
  layoutDataList = [];
  load: boolean = false;
  layoutDrawerTitle = '';
  layout(data: TheaterMasterr): void {
    this.load = true;
    this.layoutDrawerTitle = data.NAME;
    if (data.ID != undefined) {
      this.theaterId = data.ID;
      this.api
        .getallTheatrelayout(0, 0, '', 'desc', ' AND THEATRE_ID =' + data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.layoutDataList = data['data'];
            this.layoutVisible = true;
          } else {
            this.layoutDataList = [];
          }
        });
    } else {
    }
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.search();
    this.drawerVisible1 = false;
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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

  layoutVisible = false;

  close(): void {
    this.layoutVisible = false;
  }
  close1(): void {
    this.drawerClose();
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    // this.FROM_DATE = null;
    // this.TO_DATE = null;
    // this.selectedDate = [];
    this.cityid = null;
    this.isFilterApplied = 'default';
    // this.filterQuery = ' AND IS_ACTIVE=1';
    this.clickevent('A');
    this.listOfData1 = [];
    this.dataList = [];
    this.searchText = '';
    // this.search();
  }
  isOk = true;
  applyFilter() {
    this.filterQuery = '';
    var sort: string;
    this.isOk=true
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
    if (this.cityid != undefined && this.cityid != null) {
      this.filterQuery = ' AND CITY_ID = ' + this.cityid;
    }
    if (this.showcolor0 == 1) {
      this.filterQuery += ' AND STATUS=1';
    }
    if (this.showcolor1 == 1) {
      this.filterQuery += ' AND STATUS=0';
    }
    if (this.cityid == null || this.cityid == undefined) {
      this.isOk = false;
      this.message.error('Please Select City Filter', '');
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
      this.isOk=false
    }
     else if (this.isOk) {
      this.loadingRecords = true;
      this.search();
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
    }
  }

  DownloadExcel() {
    this.isOk = true;
    this.isSpinning = true;
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    if (this.totalRecords == 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('There is No Data Found..', '');
    } else {
      this.api
        .getTheatreMaster(0, 0, '', '', this.filterQuery + likeQuery + this.extraFilter)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.listOfData1 = data['data'];
              // for (let i = 0; i <= this.listOfData1.length; i++) {
              //   if (
              //     this.listOfData1[i]?.FROM_DATE != undefined &&
              //     this.listOfData1[i]?.TO_DATE != undefined
              //   ) {
              //     this.listOfData1[i].FROM_DATE = this.datePipe.transform(
              //       this.listOfData1[i]?.FROM_DATE,
              //       'dd-MM-yyyy'
              //     );
              //     this.listOfData1[i].TO_DATE = this.datePipe.transform(
              //       this.listOfData1[i]?.TO_DATE,
              //       'dd-MM-yyyy'
              //     );
              //   }
              // }

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
