import { Component, OnInit, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
// import { Master } from 'src/app/Models/master';
import { Master } from 'src/app/Models/Show Master';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Theatrelayoutmapping } from 'src/app/Models/theatrelayoutmapping';
import { Theatrelayoutmapping2 } from 'src/app/Models/Theatrelayoutmapping2';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-adddata',
  templateUrl: './adddata.component.html',
  styleUrls: ['./adddata.component.css'],
})
export class AdddataComponent implements OnInit {
  onlynumber = /^[0-9]*$/;
  dateFormat = 'dd/MM/yyyy';
  // TIME: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  loadmodal = false;
  height: any = 200;
  width: any = 100;
  today = new Date();
  @Input() drawerClose!: Function;
  @Input() data: Master = new Master();
  @Input() layoutDataList = [];
  @Input() theaterId: any;
  screenwidth = window.innerWidth;
  loadingRecords = false;
  drawerData1: Theatrelayoutmapping2 = new Theatrelayoutmapping2();
  count: number = 0;
  details: any = [];
  @Input() detail: any = [];
  @Input() cityId: any = [];
  detail1: any = [];
  inputValue: any;
  isOkLoading = false;
  title = '';
  isVisible = false;
  @Input() drawerVisible = false;
  Imgurldata: string = '';
  isSpinning = false;
  isOk = true;
  end: any;
  log: any;
  theaterId2: any;
  currentDate: any;
  @Input() FROM_DATE: any;
  @Input() TO_DATE: any;
  DATE: any;
  theatreId: any;
  userId: any;
  @Input() distributorslist: any[] = [];
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}
  @ViewChildren('inputElement')
  inputElements!: QueryList<ElementRef>;
  ngOnInit(): void {
    this.theatreId = sessionStorage.getItem('theatreId');
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatermasterget();
    this.disabledDate = (current: Date): boolean => {
      var a: any;
      var b: any;
      if (this.FROM_DATE) {
        a = differenceInCalendarDays(current, new Date(this.FROM_DATE));
      }
      if (this.TO_DATE) {
        b = differenceInCalendarDays(current, new Date(this.TO_DATE));
      }
      if (a < 0 || b > 0) return true;
      else return false;
    };

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  focusInput(index: number): void {
    
    const inputArray = this.inputElements.toArray();
    
    if (inputArray[index]) {
      inputArray[index].nativeElement.focus();
    }
  }
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }
  extraFilter: any;
  theatermasterget() {
    this.loadingRecords = true;
    if (this.userId != 1) {
      this.extraFilter = ' AND ID in(' + this.theatreId + ')';
    } else {
      this.extraFilter = '';
    }
    this.api
      .getTheatreMaster(0, 0, '', 'asc', ' AND STATUS=1' + this.extraFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.details = data['data'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    // this.api.userTheatreMapping(0, 0, '', 'asc', '').subscribe((data) => {
    //   if (data.code == 200) {
    //     if (data.count > 0) {
    //       this.distributorslist = data['data'];
    //     } else {
    //       this.distributorslist = [];
    //       this.data.DISTIBUTOR_ID = undefined;
    //       // this.message.error('No Distributors Found','')
    //     }
    //   } else {
    //     this.message.error('Failed To Get Records', '');
    //   }
    // });
  }

  dramamasterget() {
    this.loadingRecords = true;
    this.theatermasterget();

    this.api.getdramaMaster(0, 0, '', 'asc', ' AND STATUS=1').subscribe(
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

  layoutdata: any = [];
  loadlayout() {
    this.loadingRecords = true;
    this.api
      .getallTheatrelayout(
        0,
        0,
        '',
        'asc',
        ' AND THEATRE_ID = ' + this.data.THEATRE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.layoutdata = data['data'];
            if (this.layoutdata.length > 0) {
              this.data.TICKET_RATE = this.layoutdata;
            } else {
              this.data.TICKET_RATE = [];
            }
          } else {
            this.layoutdata = [];
            this.data.TICKET_RATE = [];
          }
        },
        (err) => {
          console.log(err);
          this.isSpinning = false;
        }
      );
  }
  close(): void {
    this.drawerClose();
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  resetDrawer(ShowProductform: NgForm) {
    this.data = new Master();
    ShowProductform.form.markAsPristine();
    ShowProductform.form.markAsUntouched();
    this.theatermasterget();
  }

  LAYOUT_ID: any;
  save(addNew: boolean, ShowProductform: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.THEATRE_ID == 0 &&
      this.data.DRAMA_ID == 0 &&
      (this.data.DISTIBUTOR_ID == null ||
        this.data.DISTIBUTOR_ID == undefined) &&
      this.data.DATE == undefined &&
      this.data.START_TIME == undefined &&
      this.data.END_TIME == undefined &&
      this.data.BOOKING_STATUS == undefined &&
      this.data.TICKET_RATE == undefined
    ) {
      this.isOk = false;

      this.message.error(' Please Fill All Required Fields ', '');
    } else if (this.data.THEATRE_ID == null || this.data.THEATRE_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Theatre Name', '');
    } else if (this.data.DRAMA_ID == null || this.data.DRAMA_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Drama Name', '');
    } else if (
      this.data.DISTIBUTOR_ID == null ||
      this.data.DISTIBUTOR_ID == undefined ||
      this.data.DISTIBUTOR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Distributor Name', '');
    } else if (this.data.DATE == null || this.data.DATE == undefined) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    } else if (
      this.data.START_TIME == null ||
      this.data.START_TIME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Start Time', '');
    }
    // else if (this.data.END_TIME == null || this.data.END_TIME == undefined) {
    //   this.isOk = false;
    //   this.message.error('Please Select End Time', '');
    // }
    else if (
      this.data.BOOKING_STATUS == null ||
      this.data.BOOKING_STATUS == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Booking Status', '');
    } else if (
      this.data.TICKET_RATE.length == 0
    ) {
      this.isOk = false;
      this.message.error(
        'Please Create Layout Group for Selected Theater Name',
        ''
      );
    }

    if (this.isOk) {
      this.isSpinning = true;

      // Check if this.data.DATE is a valid date
      if (
        this.data.DATE == undefined ||
        this.data.DATE == null ||
        isNaN(Date.parse(this.data.DATE))
      ) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.data.DATE
          ? this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd')
          : '';
      }

      // Check if this.data.START_TIME is a valid date
      if (
        this.data.START_TIME == undefined ||
        this.data.START_TIME == null ||
        isNaN(Date.parse(this.data.START_TIME))
      ) {
        this.data.START_TIME = null;
      } else {
        
        this.data.START_TIME = this.data.START_TIME
          ? this.datePipe.transform(this.data.START_TIME, 'HH:mm')
          : '';
      }

      // Check if this.data.END_TIME is a valid date
      if (
        this.data.END_TIME == undefined ||
        this.data.END_TIME == null ||
        isNaN(Date.parse(this.data.END_TIME))
      ) {
        this.data.END_TIME = null;
      } else {
        
        this.data.END_TIME = this.data.END_TIME
          ? this.datePipe.transform(this.data.END_TIME, 'HH:mm')
          : '';
      }

      if (this.data.ID) {
        if (this.data.BOOKING_STATUS == 'S') {
          this.api
            .checkSeatAvailableOrNot(this.data.ID, this.data.THEATRE_ID)
            .subscribe((successCode1) => {
              if (successCode1.code == '200') {
                this.api
                  .updatedatamaster(this.data)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success(
                        ' Information Updated Successfully...',
                        ''
                      );
                      if (!addNew) this.drawerClose();
                      this.isSpinning = false;
                    } else if (successCode.code == '300') {
                      this.message.error(
                        'First Apply Seat Layout To This Theater Name',
                        ''
                      );
                      this.isSpinning = false;
                    } else {
                      this.message.error(
                        ' Failed To Update Information...',
                        ''
                      );
                      this.isSpinning = false;
                    }
                  });
              } else if (successCode1.code == '300') {
                this.message.error('Atleast One Row Available For Booking', '');
                this.isSpinning = false;
              } else {
                this.message.error(' Failed To Update Information...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api.updatedatamaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else if (successCode.code == '300') {
              this.message.error(
                'First Apply Seat Layout To This Theater Name',
                ''
              );
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
        }
      } else {
        this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        if (this.currentDate == this.data.DATE) {
          this.data.SHOW_STATUS = 'O';
        } else if (this.currentDate < this.data.DATE) {
          this.data.SHOW_STATUS = 'U';
        } else {
        }
        this.api
          .createDatamaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new Master();
                this.resetDrawer(ShowProductform);
                this.api.getmaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.ID = 1;
                    } else {
                      this.data.ID = data['data'][0]['ID'] + 1;
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              }
              this.isSpinning = false;
            } else if (successCode.code == '300') {
              this.message.error(
                'First Apply Seat Layout To This Theater Name',
                ''
              );
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  layoutbuttonVisible = false;
  layoutbutton: any;
  layoutbuttonDataList = [];
  layoutbutton1(data: Theatrelayoutmapping): void {
    this.layoutbutton = data.ID;
    this.layoutbuttonVisible = true;
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
      .getallTheatrelayoutmapping(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
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
  }

  filterdrama(event: any) {
    this.api
      .getdramaMaster(0, 0, '', 'asc', ' AND STATUS=1  AND ID =' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data.DATE = null;
            this.loadingRecords = false;
            this.detail1 = data['data'];
            this.FROM_DATE = data['data'][0]['FROM_DATE'];
            this.TO_DATE = data['data'][0]['TO_DATE'];

            // var a = data['data'][0]['FROM_DATE'];
            // this.FROM_DATE = new Date(a);
            // var b = data['data'][0]['TO_DATE'];
            // this.TO_DATE = new Date(b);
          }
        },
        (err) => {
          console.log(err);
        }
      );

    this.disabledDate = (current: Date): boolean => {
      var a = differenceInCalendarDays(current, new Date(this.FROM_DATE));
      var b = differenceInCalendarDays(current, new Date(this.TO_DATE));
      if (a < 0 || b > 0) return true;
      else return false;
    };
  }

  disabledDate = (current: Date): boolean => {
    var a = differenceInCalendarDays(current, this.FROM_DATE);
    var b = differenceInCalendarDays(current, this.TO_DATE);
    if (a < 0 || b > 0) return true;
    else return false;
  };

  disabledStartDate2() {
    if (this.detail1.FROM_DATE != undefined) {
      return (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.detail1.FROM_DATE)) >
          0 || differenceInCalendarDays(current, this.today) < 0;
    } else {
      return (current: Date): boolean =>
        differenceInCalendarDays(current, this.today) < 0;
    }
  }

  filterlayout(event: any) {
    this.loadlayout();
    this.api
      .getTheatreMaster(0, 0, '', 'asc', ' AND STATUS=1 AND ID =' + event)
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
            this.data.DATE = null;
            this.detail = [];
            this.data.DRAMA_ID = '';
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

    this.loadingRecords = true;
    this.theaterId2 = this.data.THEATRE_ID;
    this.api.getSeatCounts(this.data.THEATRE_ID).subscribe(data=>{

      if(data['code']==200){
        this.data.TOTAL_SEATS = data['data'][0]['TOTAL'];
        this.data.AVAILABLE_SEATS = data['data'][0]['AVAILABLE'];
      }
    })
    // this.api
    //   .getallTheatrelayout(
    //     0,
    //     0,
    //     '',
    //     'asc',
    //     ' AND THEATRE_ID = ' + this.data.THEATRE_ID
    //   )
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.loadingRecords = false;
    //         this.layoutdata = data['data'];

    //         if (this.layoutdata.length > 0) {
    //           this.newArray = [];
    //           this.data.TOTAL_SEATS = 0;
    //           for (let i = 0; i < this.layoutdata.length; i++) {
    //             this.api
    //               .getallTheatrelayoutmapping(
    //                 0,
    //                 0,
    //                 '',
    //                 'asc',
    //                 ' AND THEATRE_ID = ' +
    //                   this.data.THEATRE_ID +
    //                   ' AND LAYOUT_ID =' +
    //                   this.layoutdata[i]['LAYOUT_ID']
    //               )
    //               .subscribe((data) => {
    //                 if (data['code'] == 200) {
    //                   this.loadingRecords = false;
    //                   this.newArray.push(...data['data']);
    //                   let SumOfSeats = 0;
    //                   let sumofavilableseat = 0;

    //                   if (this.newArray.length > 0) {
    //                     for (let k = 0; k < this.newArray.length; k++) {
    //                       SumOfSeats += Number(
    //                         this.newArray[k]['END_SEAT_NUMBER']
    //                       );
    //                       if (
    //                         this.newArray[k]['IS_AVAILABLE_FOR_BOOKING'] == 1
    //                       ) {
    //                         sumofavilableseat += Number(
    //                           this.newArray[k]['END_SEAT_NUMBER']
    //                         );
    //                       }
    //                     }
    //                     // this.getData();
    //                     this.data.TOTAL_SEATS = SumOfSeats;
    //                     this.data.AVAILABLE_SEATS = sumofavilableseat;
    //                   }
    //                 } else console.log('error');
    //               });
    //           }
    //         } else {
    //           this.data.TOTAL_SEATS = 0;
    //           this.data.AVAILABLE_SEATS = 0;
    //         }
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //       this.isSpinning = false;
    //     }
    //   );
  }
  cityIDS: any = [];
  Master: any;
  CityData: any;
  getDistributor(event: any) {
    if (event) {
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
                    this.detail = data['data'];
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
      this.api
        .userTheatreMapping(0, 0, '', 'asc', ' AND THEATRE_ID = ' + event)
        .subscribe((data) => {
          if (data.code == 200) {
            if (data.count > 0) {
              this.distributorslist = data['data'];
            } else {
              this.distributorslist = [];
              this.data.DISTIBUTOR_ID = undefined;
              this.message.error('No Distributors Found', '');
            }
          } else {
            this.message.error('Failed To Get Records', '');
          }
        });
    } else {
      this.distributorslist = [];
      this.detail = [];
      this.data.DRAMA_ID = undefined;
      this.data.DISTIBUTOR_ID = undefined;
    }
  }

  newArray: any[] = [];
  // getData() {
  //   this.data.TOTAL_SEATS = 0;
  //   this.loadingRecords = true;

  //   if (this.newArray.length > 0) {
  //     for (let k = 0; k <= this.newArray.length; k++) {
  //       this.data.TOTAL_SEATS += Number(this.newArray[k]['END_SEAT_NUMBER']);

  //     }
  //     this.newArray = [];
  //   }

  // }

  // getcount() {
  //   this.api
  //     .getallshowseatbookingdetails(
  //       0,
  //       0,
  //       '',
  //       'asc',
  //       ' AND SHOW_ID =' + this.showmasterid
  //     )
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.showlayoutDataList = data['data'];

  //       } else {

  //       }
  //     });
  // }

  showModal(): void {
    this.isSpinning = true;
    this.theaterId2 = this.data.THEATRE_ID;
    if (this.theaterId2 == undefined || this.theaterId2 == 0) {
      this.message.warning('First Select Theater Name', '');
      this.isSpinning = false;
    } else {
      this.Imgurldata = '';
      if (this.data.ID == undefined) {
        this.api.getshowlayoutimage(this.theaterId2).subscribe((data) => {
          if (data['code'] == 200) {
            this.isVisible = true;
            this.loadmodal = true;
            setTimeout(() => {
              this.Imgurldata = 'http://' + data['data']['preview_img'];
              this.loadmodal = false;
            }, 2000);
            this.isSpinning = false;
          } else if (data['code'] == '300') {
            this.message.error(
              'First Apply Seat Layout To This Theater Name',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.Imgurldata = '';
        this.api.getshowlayoutimage(this.data.THEATRE_ID).subscribe((data) => {
          if (data['code'] == 200) {
            this.isVisible = true;
            this.loadmodal = true;
            setTimeout(() => {
              this.Imgurldata = 'http://' + data['data']['preview_img'];
              this.loadmodal = false;
            }, 2000);
            this.isSpinning = false;
          } else if (data['code'] == '300') {
            this.message.error(
              'First Apply Seat Layout To This Theater Name',
              ''
            );
            this.isSpinning = false;
          }
          {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  editimage() {
    this.Imgurldata = '';
    this.isSpinning = true;
    this.api
      .getallshowseatbookingdetailsimage(
        0,
        0,
        '',
        'desc',
        ' AND SHOW_ID =' + this.data.ID,
        this.data.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isVisible = true;
          this.loadmodal = true;
          setTimeout(() => {
            this.Imgurldata = 'http://' + data['data']['layout_img'];
            this.loadmodal = false;
          }, 2000);

          // this.Imgurldata = 'http://' + data['data']['preview_img'];
          this.isSpinning = false;
        } else if (data['code'] == 300) {
          this.message.error(
            'First Apply Seat Layout To This Theater Name',
            ''
          );
          this.isSpinning = false;
        } else {
          this.message.error('Something Went Wrong', '');
          this.isSpinning = false;
        }
      });
  }

  // showModal(data: Theatrelayoutmapping2): void {
  //   this.layoutbutton = data.ID;

  //   this.api
  //     .getlayoutgroupnameseatimage(

  //         this.layoutmapId,
  //         this.theaterId
  //     )
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.Imgurldata = 'http://' + data['data']['preview_img'];
  //         // this.Imgurldata = data['data']['preview_img'];

  //       }
  //     });

  //   this.isVisible = true;
  // }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  todays = new Date();

  disabled = (current: Date): boolean =>
    differenceInCalendarDays(current, this.FROM_DATE) < 0;
  dates: any = [];
  isShowToday: boolean = false;
  openOnlyMappedDates() {
    if (
      this.data.DATE == undefined ||
      this.data.DATE == null ||
      this.data.DATE == ''
    ) {
      this.data.DATE = this.FROM_DATE;
    } else {
      this.data.DATE = this.data.DATE;
    }
    const fromDate = new Date(this.FROM_DATE);
    const toDate = new Date(this.TO_DATE);

    const currentDate = new Date();

    this.isShowToday = currentDate >= fromDate && currentDate <= toDate;

    return this.isShowToday;
  }
}
