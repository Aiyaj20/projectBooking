import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FolderAddFill } from '@ant-design/icons-angular/icons';

import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Theatremastercl } from 'src/app/Models/groupactivitylist';
import { SeatlayoutGroupNames } from 'src/app/Models/seatlayoutgroupname';
import { Theatrelayoutmapping } from 'src/app/Models/theatrelayoutmapping';
import { Theatrelayoutmapping2 } from 'src/app/Models/Theatrelayoutmapping2';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
@Component({
  selector: 'app-layoutbutton',
  templateUrl: './layoutbutton.component.html',
  styleUrls: ['./layoutbutton.component.css'],
})
export class LayoutbuttonComponent implements OnInit {
  current = new Date();
  allMaster: any = [];
  pageSize = 10;
  pageIndex = 1;
  sortKey: string = 'id';
  sortValue: string = 'desc';
  isSpinning = false;
  onlynumber = /^[0-9]*$/;
  @Input()
  isShowWiseLayout: boolean = false;
  screenwidth = window.innerWidth;
  drawerData1: Theatrelayoutmapping2 = new Theatrelayoutmapping2();
  LAYOUT_ID: number = 0;
  PRICE: number = 0;
  @Input()
  data: Theatrelayoutmapping = new Theatrelayoutmapping();
  layoutgrp: any = [];
  @Input() loadingRecords = false;
  @Input() theaterId: any;
  @Input() load: any;
  @Input()
  RateaArray: any = [];
  @Input()
  drawerClose!: Function;
  @Input()
  drawerClose1!: Function;
  theatremaster: Theatremastercl[] = [];
  @Input() layoutDataList = [];
  layoutDataList1 = [];
  layoutgrpnameimage = [];
  editId: any;
  isVisible = false;
  isOkLoading = false;
  isOk: boolean = false;
  seatlayoutgrpname: any = [];
  layoutmapId: number = 0;
  Imgurldata: any = '';
  loadmodal = false;
  @Input()
  bookingStatus=''
  @Input()
  masterid: any;
  constructor(
    private api: ClientmasterService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loadseatlayoutgrpname();

  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.current) < 0;

  loadseatlayoutgrpname() {
    this.api.getAllSeatlayoutgrpnames(0, 0, '', '', 'AND STATUS=1').subscribe(
      (data) => {
        this.seatlayoutgrpname = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
  }

  layoutbutton: any;
  layoutbuttonDataList = [];
  seatlayouttitle=''
  layoutbutton1(data: Theatrelayoutmapping): void {
    this.layoutbuttonVisible = true;
    // console.log(data);
    this.seatlayouttitle='Create Seat Details'
    if (!this.isShowWiseLayout) {
      if (data.ID && data.ID > 0) {
        this.layoutbutton = data.ID;
        this.layoutmapId = data.ID;
        this.api
          .getallTheatrelayoutmapping(
            0,
            0,
            '',
            'desc',
            ' AND THEATRE_LAYOUT_MAPPING_ID  =' + data.ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.layoutbuttonDataList = data['data'];

            }
          });
        this.layoutbuttonVisible = true;
        this.api
          .getallTheatrelayoutmapping(
            1,
            1,
            'SEQUENCE_NUMBER',
            'desc',
            ''
          )
          .subscribe(
            (data) => {
              if (data['count'] == 0) {
                this.drawerData1.SEQUENCE_NUMBER = 1;
              } else {
                this.drawerData1.SEQUENCE_NUMBER =
                  data['data'][0]['SEQUENCE_NUMBER'] + 1;
              }
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
      }
    } else {
      if (data.ID && data.ID > 0) {
        this.layoutbutton = data.ID;
        this.layoutmapId = data.ID;
        this.api
          .getallshowlayoutmapping(
            0,
            0,
            '',
            'desc',
            ' AND SHOW_ID  =' +
              this.masterid +
              ' AND THEATRE_LAYOUT_MAPPING_ID  =' +
              this.layoutbutton
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.layoutbuttonDataList = data['data'];
            }
          });
        this.layoutbuttonVisible = true;
        this.api
          .getallshowlayoutmapping(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
          .subscribe(
            (data) => {
              if (data['count'] == 0) {
                this.drawerData1.SEQUENCE_NUMBER = 1;
              } else {
                this.drawerData1.SEQUENCE_NUMBER =
                  data['data'][0]['SEQUENCE_NUMBER'] + 1;
              }
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
      }
    }
  }

  layoutbuttonVisible = false;
  onPriceChange(price: number) {
    this.data.TOTAL_AMOUNT = 0;
    if (price && price > 0) {
      this.data.TOTAL_AMOUNT = Number(price) + Number(this.data.TOTAL_AMOUNT);
    }
    if (this.data.TAX_AMOUNT > 0) {
      this.data.TOTAL_AMOUNT += Number(this.data.TAX_AMOUNT);
    }

  }
  onTaxAmountChange(taxamount: number) {
    if (Number(taxamount) > Number(this.data.DEFAULT_RATE)) {
      this.message.error('Tax Amount Should Be Less than Price', '');
      this.data.TAX_AMOUNT = 0;
    } else {
      this.data.TOTAL_AMOUNT = 0;
      if (taxamount && taxamount > 0) {
        this.data.TOTAL_AMOUNT =
          Number(taxamount) + Number(this.data.TOTAL_AMOUNT);
      }
      if (this.data.DEFAULT_RATE > 0) {
        this.data.TOTAL_AMOUNT += Number(this.data.DEFAULT_RATE);
      }
    }
  }
  close(): void {
    // localStorage.removeItem('img');
    this.layoutbuttonVisible = false;
    this.drawerClose();
  }

  close1(): void {
    this.layoutbuttonVisible = false;
    // this.drawerClose();
  }

  get closeCallback() {
    return this.close.bind(this);
  }
  get closeCallback1() {
    return this.close1.bind(this);
  }

  getData() {
    this.api
      .getallTheatrelayout(
        0,
        0,
        '',
        'asc',
        ' AND THEATRE_ID =' + this.theaterId
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.layoutDataList = data['data'];

          this.layoutDataList.forEach((layout: any) => {
            // Find the corresponding object in RateaArray
            const rateObject = this.RateaArray.find(
              (rate: { LAYOUT_ID: any }) => rate.LAYOUT_ID === layout.LAYOUT_ID
            );

            // If a corresponding object is found
            if (rateObject) {
              // Update the DEFAULT_RATE with AMOUNT from RateaArray
              layout.DEFAULT_RATE = rateObject.AMOUNT;
            }
          });
          // this.data.SEQUENCE_NUMBER =
          // Number(this.layoutDataList.length) + 1;
        }
      });
  }

  // getData1() {
  //   this.api
  //     .getallTheatrelayout(
  //       0,
  //       0,
  //       '',
  //       'asc',
  //       ' AND THEATRE_ID =' + this.theaterId
  //     )
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.loadingRecords = false;
  //         this.layoutDataList1 = data['data'];
  //       }
  //     });
  // }

  addData(addNew: boolean, form11: NgForm) {
    this.loadingRecords = false;
    this.isOk = true;
    this.data.THEATRE_ID = this.theaterId;

    if (this.data.LAYOUT_ID <= 0 && this.data.DEFAULT_RATE <= 0) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (this.data.THEATRE_ID == null || this.data.THEATRE_ID == 0) {
      this.isOk = false;
      this.message.error('Please Select Theater Name', '');
    } else if (this.data.LAYOUT_ID == null || this.data.LAYOUT_ID == 0) {
      this.isOk = false;
      this.message.error('Please Select Layout Group', '');
    } else if (this.data.DEFAULT_RATE == null || this.data.DEFAULT_RATE <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Price', '');
    } else if (this.data.TAX_AMOUNT == null || this.data.TAX_AMOUNT < 0) {
      this.isOk = false;
      this.message.error('Please Enter Tax Amount', '');
    } else if (this.data.TOTAL_AMOUNT == null || this.data.TOTAL_AMOUNT < 0) {
      this.isOk = false;
      this.message.error('Please Enter Total Amount', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        var religionID = this.layoutDataList1.filter((obj) => {
          return obj['LAYOUT_ID'] == this.data.LAYOUT_ID;
        });
        if (religionID.length == 0) {
          this.api.updateTheatrelayout(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Information Updated Successfully', '');
              this.resetDrawer(form11);
              this.data = new Theatrelayoutmapping();
              this.getData();
              this.isSpinning = false;
            } else {
              this.message.error('Information Not Updated', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.message.error(
            'Layout Name Already Exist. Please Select Different Layout',
            ''
          );
          this.isSpinning = false;
        }
      } else {
        var religionData = this.layoutDataList.filter((obj) => {
          return obj['LAYOUT_ID'] == this.data.LAYOUT_ID;
        });

        if (religionData.length == 0) {
          this.api.createTheatrelayout(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.isSpinning = false;

              this.message.success('Information Saved Successfully', '');

              // if () {
              // } else {
                this.resetDrawer(form11);
                this.data = new Theatrelayoutmapping();
                this.getData();

                var countryData = this.layoutDataList.filter((obj) => {
                  return obj['LAYOUT_ID'] == this.data.LAYOUT_ID;
                });
                if (countryData.length == 0) {
                  this.data = new Theatrelayoutmapping();
                } else {
                  this.message.error(
                    'Layout Name Already Exist. Please Enter Other Layout Name',
                    ''
                  );
                  this.isSpinning = false;
                }
              // }
            } else {
              this.message.error('Information Not Saved', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.message.error(
            'Layout Already Exist. Please Enter Other Layout Name',
            ''
          );
          this.isSpinning = false;
        }
      }
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  sort(params: NzTableQueryParams): void {
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
    this.getData();
  }

  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  layoutid: any;
  isStarted = false;
  dislabe: boolean = false;
  deletebooking(data: any) {
    this.loadingRecords = true;

    this.api
      .getmaster(0, 0, '', '', 'AND THEATRE_ID = ' + data.THEATRE_ID)
      .subscribe((data1: any) => {
        this.allMaster = data1['data'];
        for (let i = 0; i < this.allMaster.length; i++) {
          if (this.allMaster[i]['BOOKING_STATUS'] == 'S') {
            this.isStarted = true;
          } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BF') {
            this.isStarted = true;
          } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BS') {
            this.isStarted = true;
          }
        }

        if (this.isStarted == false) {
          this.api
            .deletebookingmaster({
              LAYOUT_ID: data.LAYOUT_ID,
              THEATRE_ID: data.THEATRE_ID,
            })
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('This Layout Group Has Been Deleted', '');

                setTimeout(() => {
                  this.loadingRecords = false;

                  this.getData();
                }, 1000);
              } else {
                this.loadingRecords = false;
                this.message.error('Failed to Store Information', '');
              }
            });
        } else {
          this.message.error(
            'This Show is Presenting on Screen We Cannot Delete the Show ',
            ''
          );
          this.loadingRecords = false;
        }
      });
  }

  resetDrawer(form11: NgForm) {
    this.data = new Theatrelayoutmapping();
    form11.form.markAsPristine();
    form11.form.markAsUntouched();
  }
  assignLayout() {
    if (this.masterid && this.theaterId) {
      this.loadingRecords = true;
      this.api
        .assignShowlayout(this.masterid, this.theaterId)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.message.success('Layout Assigned Successfully', '');
            this.close();
          } else {
            this.loadingRecords = false;
            this.message.error('Layout Assigned Failed', '');
          }
        });
    }
  }
  showModal(): void {
    if (!this.isShowWiseLayout) {
      this.api
        .getlayoutgroupnameseatimage(this.layoutmapId, this.theaterId)
        .subscribe((data) => {
          this.Imgurldata = '';
          if (data['code'] == 200) {
            this.loadmodal = true;
            sessionStorage.setItem(
              'img',
              'http://' + data['data']['preview_img']
            );
            setTimeout(() => {
              this.Imgurldata = sessionStorage.getItem('img');
              this.loadmodal = false;
            }, 7000);

            this.isVisible = true;
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
          }
        });
    } else {
      this.api
        .getlayoutgroupnameseatimage2(
          this.layoutmapId,
          this.theaterId,
          this.masterid
        )
        .subscribe((data) => {
          this.Imgurldata = '';
          if (data['code'] == 200) {
            this.loadmodal = true;
            sessionStorage.setItem(
              'img',
              'http://' + data['data']['preview_img']
            );
            setTimeout(() => {
              this.Imgurldata = sessionStorage.getItem('img');
              this.loadmodal = false;
            }, 7000);

            this.isVisible = true;
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
          }
        });
    }
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    sessionStorage.removeItem('img');
    this.isVisible = false;
  }

  edit(data: Theatrelayoutmapping): void {
    if (data.DEFAULT_RATE || data.TAX_AMOUNT) {
      data.TOTAL_AMOUNT = data.DEFAULT_RATE + data.TAX_AMOUNT;
    }
    this.data = Object.assign({}, data);

    this.api
      .getallTheatrelayout(
        0,
        0,
        '',
        'desc',
        ' AND THEATRE_ID =' + this.theaterId + ' AND ID!=' + data.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.layoutDataList1 = data['data'];
        }
      });
  }
}
