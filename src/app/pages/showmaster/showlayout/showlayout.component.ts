import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ControlOutline } from '@ant-design/icons-angular/icons';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { SeatlayoutGroupNames } from 'src/app/Models/seatlayoutgroupname';
import { Showlayoutrates } from 'src/app/Models/showlayoutrates';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-showlayout',
  templateUrl: './showlayout.component.html',
  styleUrls: ['./showlayout.component.css'],
})
export class ShowlayoutComponent implements OnInit {
  @Input() showlayout: any;
  @Input() showlayoutDataList: any[] = [];
  @Input() ImageUrl: string = '';
  @Input() ShowCountsdata: any;
  @Input()
  data: Showlayoutrates = new Showlayoutrates();
  @Input() previewavail: any;
  screenwidth = window.innerWidth;
  seatlayoutgrpname: SeatlayoutGroupNames[] = [];
  @Input() showmasterid: any;
  @Input() drawerClose!: Function;
  @Input()
  showStatus: any
  isOk: boolean = false;
  isSpinning = false;
  onlynumber = /^[0-9]*$/;
  loadingRecords = false;
  radioValue = '';
  status = 'A';
  isLoadingOne = false;
  showdata: any[] = [];
  pageSize = 10;
  pageIndex = 1;
  imgUrl = appkeys.retriveimgUrl;
  totalRecords = 1;
  searchText: string = '';
  sortValue: string = 'desc';
  sortKey: string = 'id';
  @Input() statuss: any;
  @Input() changeBoolean!: Function;
  columns: string[][] = [
    ['GROUP_LAYOUT_NAME', 'Seat Layout Name'],
    ['ROW_NAME', 'Row Name'],
    ['SEAT_NUMBER', 'Seat Number'],
    ['SEAT_STATUS', 'Status'],
  ];

  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.loadseatlayoutgrpname();
    // this.getData();

  }
  // statuss: boolean = false;
  statuschange() {
    if (this.statuss) {
      this.status = 'A';
    } else {
      this.status = 'B';
    }
  }

  imageLoader: boolean = false;
  statuschange2(event: any) {
    if (event == false) {
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
            this.showlayoutDataList = data['data'];

            this.load = false;
            this.isLoadingOne = false;
          } else {
            this.load = false;
            this.isLoadingOne = false;
            this.showlayoutDataList = [];
          }
        });
      this.changeBoolean(false);
    } else {
      this.message.info('Please Wait Image is Loading...', '');
      this.load = true;

      this.api
        .getallshowseatbookingdetailsimage(
          0,
          0,
          '',
          'asc',
          ' AND SHOW_ID =' + this.showmasterid,
          this.showmasterid
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.load = true;

            setTimeout(() => {
              this.ImageUrl = 'http://' + data['data']['layout_img'];
              this.load = false;
            }, 2000);
            // this.ImageUrl = 'http://' + data['data']['layout_img'];
          } else {
            this.ImageUrl = '';
            this.load = false;
          }
        });
      this.changeBoolean(true);
    }
  }

  loadseatlayoutgrpname() {
    this.api.getAllSeatlayoutgrpnames(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        this.seatlayoutgrpname = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
  }

  changeTable(event: any) {
    if (this.radioValue == 'A') {
      this.radioValue == 'A';
    } else {
      this.radioValue == 'B';
    }
  }

  addData(showLayout: NgForm) {
    this.isOk = true;
    this.data.SHOW_MASTER_ID = this.showmasterid;

    if (this.data.LAYOUT_ID <= 0 && this.data.TICKET_RATE <= 0) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (this.data.LAYOUT_ID == null || this.data.LAYOUT_ID == 0) {
      this.isOk = false;
      this.message.error('Please Select Layout Group', '');
    } else if (this.data.TICKET_RATE == null || this.data.TICKET_RATE <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Price', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateshowlayoutrates(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Updated Successfully', '');
              this.resetDrawer(showLayout);
              this.getData();

              // this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Not Updated', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createshowlayoutrates(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully', '');
              this.data = new Showlayoutrates();
              this.resetDrawer(showLayout);
              this.getData();

              // this.drawerClose();

              this.isSpinning = false;
            } else {
              this.message.error('Information Not Saved', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  getData() {
    this.api
      .getallshowlayoutrates(
        0,
        0,
        '',
        'desc',
        ' AND SHOW_MASTER_ID =' + this.showmasterid
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;

          this.showlayoutDataList = data['data'];
        }
      });
  }

  showlayoutVisible = false;
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  close(): void {
    this.showlayoutDataList =[]
    this.ImageUrl=''
    this.drawerClose();
  }

  resetDrawer(showLayout: NgForm) {
    this.data = new Showlayoutrates();
    showLayout.form.markAsPristine();
    showLayout.form.markAsUntouched();
  }
  edit(data: Showlayoutrates): void {
    this.data = Object.assign({}, data);
    // this.drawerVisible = true;
  }

  load = false;

  loadOne(): void {
    if (this.statuss) {
      this.loadingRecords = true;
      this.api
        .getallshowseatbookingdetailsimage(
          0,
          0,
          '',
          'asc',
          ' AND SHOW_ID =' + this.showmasterid,
          this.showmasterid
        )
        .subscribe((data) => {

          if (data['code'] == 200) {
            this.load = true;

            setTimeout(() => {
              this.ImageUrl = 'http://' + data['data']['layout_img'];
              this.load = false;
            }, 2000);
            // this.ImageUrl = 'http://' + data['data']['layout_img'];
          } else {
            this.ImageUrl = '';
            this.load = false;
          }
        });
    } else {
      if (this.searchText != '') {
        this.searchText = '';
      } else {
      }

      this.isLoadingOne = true;
      this.loadingRecords = true;
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
            this.showlayoutDataList = data['data'];
            this.loadingRecords = false;
            this.isLoadingOne = false;
          } else {
            this.loadingRecords = false;
            this.isLoadingOne = false;
          }
        });
    }

    // setTimeout(() => {
    //   this.isLoadingOne = false;
    // }, 2000);
  }

  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
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

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
      this.sortKey = '';
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

    this.api
      .getallshowseatbookingdetails(
        0,
        0,
        this.sortKey,
        sort,
        ' AND SHOW_ID =' + this.showmasterid + likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          // this.totalRecords = data['count'];
          this.showlayoutDataList = data['data'];
        },
        (err) => {
          console.log(err);
        }
      );
  }
  keyup(event: any) {
    this.search();
  }
}
