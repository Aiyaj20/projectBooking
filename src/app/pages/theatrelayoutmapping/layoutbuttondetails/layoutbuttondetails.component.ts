import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { Theatrelayoutmapping } from 'src/app/Models/theatrelayoutmapping';
import { Theatrelayoutmapping2 } from 'src/app/Models/Theatrelayoutmapping2';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-layoutbuttondetails',
  templateUrl: './layoutbuttondetails.component.html',
  styleUrls: ['./layoutbuttondetails.component.css'],
})
export class LayoutbuttondetailsComponent implements OnInit {
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private api: ClientmasterService,
    private message: NzNotificationService
  ) {}
  allMaster: any = [];
  isOk: boolean = false;
  loadingRecords = false;
  screenwidth = window.innerWidth;
  @Input() drawerClose!: Function;
  @Input() drawerClose1!: Function;
  @Input() layoutbuttonDataList: any = [];
  @Input() layoutbutton: any;
  @Input()
  data: Theatrelayoutmapping2 = new Theatrelayoutmapping2();
  @Input() theaterId: any;
  @Input() layoutmapId: any;
  @Input()
  isShowWiseLayout: boolean = false;
  @Input()
  masterid: any;
  loadmodal = false;
  listReligionwithoutID = [];
  layoutbuttonDataList1 = [];
  editId: any;
  imgUrl = appkeys.retriveimgUrl;
  Imgurldata: any = '';
  ngOnInit(): void {
    this.getData();
    this.getData1();
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  endseatnumbar: any;
  getData() {
    this.loadingRecords = true;
    this.allChecked = false;
    this.selectedIds = [];
    this.layoutbuttonDataList = [];
    if (!this.isShowWiseLayout && this.layoutbutton) {
      this.api
        .getallTheatrelayoutmapping(
          0,
          0,
          'SEQUENCE_NUMBER',
          'desc',
          ' AND THEATRE_LAYOUT_MAPPING_ID =' + this.layoutbutton
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.layoutbuttonDataList = data['data'];
              this.layoutbuttonDataList.filter((a: any, b: any) => {
                return a.LAYOUT_ID - b.LAYOUT_ID;
              });
              this.data.SEQUENCE_NUMBER =
                Number(data['data'][0]['SEQUENCE_NUMBER']) + 1;

              this.layoutbuttonDataList = this.layoutbuttonDataList.map(
                (item: any) => ({
                  ...item,
                  checked: false, // Ensure every item has a `checked` property
                })
              );
            } else {
              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList.length) + 1;
              // this.layoutbuttonDataList.filter((a:any,b:any)=>{
              //   return a.LAYOUT_ID-b.LAYOUT_ID
              // })
            }
            this.loadingRecords = false;
          }
        });
    } else if (this.masterid && this.layoutbutton) {
      this.api
        .getallshowlayoutmapping(
          0,
          0,
          'SEQUENCE_NUMBER',
          'desc',
          ' AND SHOW_ID =' +
            this.masterid +
            ' AND THEATRE_LAYOUT_MAPPING_ID  =' +
            this.layoutbutton
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            if (data['count'] > 0) {
              this.layoutbuttonDataList = data['data'];
              this.layoutbuttonDataList.filter((a: any, b: any) => {
                return a.LAYOUT_ID - b.LAYOUT_ID;
              });
              this.data.SEQUENCE_NUMBER =
                Number(data['data'][0]['SEQUENCE_NUMBER']) + 1;
              this.layoutbuttonDataList = this.layoutbuttonDataList.map(
                (item: any) => ({
                  ...item,
                  checked: false, // Ensure every item has a `checked` property
                })
              );
            } else {
              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList.length) + 1;
              // this.layoutbuttonDataList.filter((a:any,b:any)=>{
              //   return a.LAYOUT_ID-b.LAYOUT_ID
              // })
            }
          }
        });
    }
  }

  getData1() {
    this.loadingRecords = true;
    if (!this.isShowWiseLayout && this.layoutbutton && this.editId) {
      this.api
        .getallTheatrelayoutmapping(
          0,
          0,
          '',
          'desc',
          ' AND THEATRE_LAYOUT_MAPPING_ID =' +
            this.layoutbutton +
            ' AND ID!=' +
            this.editId
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            if (data['count'] > 0) {
              this.layoutbuttonDataList1 = data['data'];

              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList1[0]['SEQUENCE_NUMBER']) + 1;
            } else {
              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList1.length) + 1;
            }
          }
        });
    } else if (
      this.isShowWiseLayout &&
      this.masterid &&
      this.layoutbutton &&
      this.editId
    ) {
      this.api
        .getallshowlayoutmapping(
          0,
          0,
          '',
          'desc',
          ' AND SHOW_ID =' +
            this.masterid +
            ' AND THEATRE_LAYOUT_MAPPING_ID  =' +
            this.layoutbutton && ' AND ID!=' + this.editId
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            if (data['count'] > 0) {
              this.layoutbuttonDataList1 = data['data'];

              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList1[0]['SEQUENCE_NUMBER']) + 1;
            } else {
              this.data.SEQUENCE_NUMBER =
                Number(this.layoutbuttonDataList1.length) + 1;
            }
          }
        });
    }
  }

  addData(addNew: boolean, form11: NgForm) {
    this.loadingRecords = false;
    this.isOk = true;
    this.data.THEATRE_LAYOUT_MAPPING_ID = this.layoutbutton;
    this.data.SHOW_ID = this.masterid;

    if (
      this.data.ROW_NAME.trim() == '' &&
      this.data.START_SEAT_NUMBER <= 0 &&
      this.data.END_SEAT_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    }
    // else if( (this.data.START_SEAT_NUMBER > this.data.END_SEAT_NUMBER) || (this.data.START_SEAT_NUMBER == this.data.END_SEAT_NUMBER)){
    //   this.isOk = false;
    //   this.message.error('Please Enter Correct End Seat Number', '');
    // }
    else if (
      (this.data.THEATRE_LAYOUT_MAPPING_ID == null ||
        this.data.THEATRE_LAYOUT_MAPPING_ID == 0) &&
      !this.isShowWiseLayout
    ) {
      this.isOk = false;
      this.message.error('Please Select Theater Name', '');
    } else if (
      this.data.ROW_NAME.trim() == '' &&
      this.data.ROW_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Row Name', '');
    } else if (
      this.data.START_SEAT_NUMBER == null ||
      this.data.START_SEAT_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Start Seat Number ', '');
    } else if (
      this.data.END_SEAT_NUMBER == null ||
      this.data.END_SEAT_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter End Seat Number', '');
    } else if (
      this.data.SEQUENCE_NUMBER == undefined ||
      this.data.SEQUENCE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    }
    var checkcondition = false;
    var datatocheck;

    if (!this.isShowWiseLayout) {
      this.api
        .getallTheatrelayoutmapping(
          0,
          0,
          '',
          'desc',
          'AND THEATRE_ID= ' + this.theaterId
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              datatocheck = data['data'];
              //  cons
              if (this.data.ROW_NAME) {
                datatocheck.forEach((datacheck: any) => {
                  if (
                    datacheck['THEATRE_LAYOUT_MAPPING_ID'] !=
                    this.data['THEATRE_LAYOUT_MAPPING_ID']
                  ) {
                    if (datacheck['ROW_NAME'] == this.data['ROW_NAME']) {
                      this.isOk = false;
                      checkcondition = true;
                    } else {
                      this.isOk = this.isOk;
                      // checkcondition = false;
                    }
                  } else {
                    this.isOk = this.isOk;
                    // checkcondition = false;
                  }
                });
              }
              if (checkcondition) {
                this.isOk = false;
                this.message.error(
                  'Cannot Add Row. Row Already Exists in Other Layout',
                  ''
                );
              }
            }
            // else{
            //   this.isOk = this.isOk;
            //   checkcondition = false;
            // }
            if (this.isOk) {
              this.loadingRecords = true;
              this.data.START_SEAT_NUMBER = Number(this.data.START_SEAT_NUMBER);
              this.data.END_SEAT_NUMBER = Number(this.data.END_SEAT_NUMBER);
              if (this.data.ID) {
                var religionID = this.layoutbuttonDataList1.filter((obj) => {
                  if (obj['ROW_NAME'] == this.data.ROW_NAME) {
                    return (this.data.SEQUENCE_NUMBER = obj['SEQUENCE_NUMBER']);
                  } else {
                    return (this.data.SEQUENCE_NUMBER =
                      this.data.SEQUENCE_NUMBER);
                  }
                  // return obj['ROW_NAME'] == this.data.ROW_NAME;
                });
                // if (religionID.length != 0) {
                //   this.data.SEQUENCE_NUMBER = religionID[0]['SEQUENCE_NUMBER'];
                // }
                // if (religionID.length == 0) {
                if (!this.isShowWiseLayout) {
                  this.api
                    .updateTheatrelayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.message.success(
                          'Information Updated Successfully',
                          ''
                        );
                        if (!addNew) this.resetDrawer(form11);
                        this.getData();
                        this.data = new Theatrelayoutmapping2();

                        this.loadingRecords = false;
                      } else {
                        this.message.error('Information Not Updated', '');
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.api
                    .updateshowlayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.message.success(
                          'Information Updated Successfully',
                          ''
                        );
                        if (!addNew) this.resetDrawer(form11);
                        this.getData();
                        this.data = new Theatrelayoutmapping2();

                        this.loadingRecords = false;
                      } else {
                        this.message.error('Information Not Updated', '');
                        this.loadingRecords = false;
                      }
                    });
                }
                // }
                // else {
                //   this.message.error(
                //     'Row Name Already Exist. Please Enter Other Row Name',
                //     ''
                //   );

                //   this.loadingRecords = false;
                // }
              } else {
                var religionData = this.layoutbuttonDataList.filter(
                  (obj: any) => {
                    if (obj['ROW_NAME'] == this.data.ROW_NAME) {
                      return (this.data.SEQUENCE_NUMBER =
                        obj['SEQUENCE_NUMBER']);
                    } else {
                      return (this.data.SEQUENCE_NUMBER =
                        this.data.SEQUENCE_NUMBER);
                    }
                    // return obj['ROW_NAME'] == this.data.ROW_NAME;
                  }
                );
                // this.data.SEQUENCE_NUMBER=religionData[0]['SEQUENCE_NUMBER']
                // if (religionData.length == 0) {
                if (!this.isShowWiseLayout) {
                  this.api
                    .createTheatrelayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.loadingRecords = false;

                        this.message.success(
                          'Information Saved Successfully',
                          ''
                        );

                        if (!addNew) {
                          this.drawerClose();
                        } else {
                          this.resetDrawer(form11);
                          this.getData();
                          // var countryData = this.layoutbuttonDataList.filter((obj) => {
                          //   return obj['ROW_NAME'] == this.data.ROW_NAME;
                          // });
                          // if (countryData.length == 0) {
                          this.data = new Theatrelayoutmapping2();
                          // } else {
                          //   this.message.error(
                          //     'Row Name Already Exist. Please Enter Other Row Name',
                          //     ''
                          //   );
                          //   this.loadingRecords = false;
                          // }
                        }
                      } else {
                        this.message.error('Information Not Saved', '');
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.api
                    .createshowlayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.loadingRecords = false;

                        this.message.success(
                          'Information Saved Successfully',
                          ''
                        );

                        if (!addNew) {
                          this.drawerClose();
                        } else {
                          this.resetDrawer(form11);
                          this.getData();
                          // var countryData = this.layoutbuttonDataList.filter((obj) => {
                          //   return obj['ROW_NAME'] == this.data.ROW_NAME;
                          // });
                          // if (countryData.length == 0) {
                          this.data = new Theatrelayoutmapping2();
                          // } else {
                          //   this.message.error(
                          //     'Row Name Already Exist. Please Enter Other Row Name',
                          //     ''
                          //   );
                          //   this.loadingRecords = false;
                          // }
                        }
                      } else {
                        this.message.error('Information Not Saved', '');
                        this.loadingRecords = false;
                      }
                    });
                }

                // } else {
                //   this.message.error(
                //     'Row Name Already Exist. Please Enter Other Row Name',
                //     ''
                //   );
                //   this.loadingRecords = false;
                // }
              }
            }
          } else {
            datatocheck = [];
          }
        });
    } else {
      this.api
        .getallshowlayoutmapping(
          0,
          0,
          '',
          'desc',
          'AND THEATRE_ID= ' + this.theaterId
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              datatocheck = data['data'];
              //  cons
              if (this.data.ROW_NAME) {
                datatocheck.forEach((datacheck: any) => {
                  if (
                    datacheck['THEATRE_LAYOUT_MAPPING_ID'] !=
                    this.data['THEATRE_LAYOUT_MAPPING_ID']
                  ) {
                    if (datacheck['ROW_NAME'] == this.data['ROW_NAME']) {
                      this.isOk = false;
                      checkcondition = true;
                    } else {
                      this.isOk = this.isOk;
                      checkcondition = false;
                    }
                  } else {
                    this.isOk = this.isOk;
                    // checkcondition = false;
                  }
                });
              }
              if (checkcondition) {
                this.isOk = false;
                this.message.error(
                  'Cannot Add Row. Row Already Exists in Other Layout',
                  ''
                );
              }
            }
            // else{
            //   this.isOk = this.isOk;
            //   checkcondition = false;
            // }
            if (this.isOk) {
              this.loadingRecords = true;
              this.data.START_SEAT_NUMBER = Number(this.data.START_SEAT_NUMBER);
              this.data.END_SEAT_NUMBER = Number(this.data.END_SEAT_NUMBER);
              if (this.data.ID) {
                var religionID = this.layoutbuttonDataList1.filter((obj) => {
                  if (obj['ROW_NAME'] == this.data.ROW_NAME) {
                    return (this.data.SEQUENCE_NUMBER = obj['SEQUENCE_NUMBER']);
                  } else {
                    return (this.data.SEQUENCE_NUMBER =
                      this.data.SEQUENCE_NUMBER);
                  }
                  // return obj['ROW_NAME'] == this.data.ROW_NAME;
                });
                // if (religionID.length != 0) {
                //   this.data.SEQUENCE_NUMBER = religionID[0]['SEQUENCE_NUMBER'];
                // }
                // if (religionID.length == 0) {
                if (!this.isShowWiseLayout) {
                  this.api
                    .updateTheatrelayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.message.success(
                          'Information Updated Successfully',
                          ''
                        );
                        if (!addNew) this.resetDrawer(form11);
                        this.getData();
                        this.data = new Theatrelayoutmapping2();

                        this.loadingRecords = false;
                      } else {
                        this.message.error('Information Not Updated', '');
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.api
                    .updateshowlayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.message.success(
                          'Information Updated Successfully',
                          ''
                        );
                        if (!addNew) this.resetDrawer(form11);
                        this.getData();
                        this.data = new Theatrelayoutmapping2();

                        this.loadingRecords = false;
                      } else {
                        this.message.error('Information Not Updated', '');
                        this.loadingRecords = false;
                      }
                    });
                }
                // }
                // else {
                //   this.message.error(
                //     'Row Name Already Exist. Please Enter Other Row Name',
                //     ''
                //   );

                //   this.loadingRecords = false;
                // }
              } else {
                var religionData = this.layoutbuttonDataList.filter(
                  (obj: any) => {
                    if (obj['ROW_NAME'] == this.data.ROW_NAME) {
                      return (this.data.SEQUENCE_NUMBER =
                        obj['SEQUENCE_NUMBER']);
                    } else {
                      return (this.data.SEQUENCE_NUMBER =
                        this.data.SEQUENCE_NUMBER);
                    }
                    // return obj['ROW_NAME'] == this.data.ROW_NAME;
                  }
                );
                // this.data.SEQUENCE_NUMBER=religionData[0]['SEQUENCE_NUMBER']
                // if (religionData.length == 0) {
                if (!this.isShowWiseLayout) {
                  this.api
                    .createTheatrelayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.loadingRecords = false;

                        this.message.success(
                          'Information Saved Successfully',
                          ''
                        );

                        if (!addNew) {
                          this.drawerClose();
                        } else {
                          this.resetDrawer(form11);
                          this.getData();
                          // var countryData = this.layoutbuttonDataList.filter((obj) => {
                          //   return obj['ROW_NAME'] == this.data.ROW_NAME;
                          // });
                          // if (countryData.length == 0) {
                          this.data = new Theatrelayoutmapping2();
                          // } else {
                          //   this.message.error(
                          //     'Row Name Already Exist. Please Enter Other Row Name',
                          //     ''
                          //   );
                          //   this.loadingRecords = false;
                          // }
                        }
                      } else {
                        this.message.error('Information Not Saved', '');
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.api
                    .createshowlayoutmapping(this.data)
                    .subscribe((successCode) => {
                      if (successCode['code'] == '200') {
                        this.loadingRecords = false;

                        this.message.success(
                          'Information Saved Successfully',
                          ''
                        );

                        if (!addNew) {
                          this.drawerClose();
                        } else {
                          this.resetDrawer(form11);
                          this.getData();
                          // var countryData = this.layoutbuttonDataList.filter((obj) => {
                          //   return obj['ROW_NAME'] == this.data.ROW_NAME;
                          // });
                          // if (countryData.length == 0) {
                          this.data = new Theatrelayoutmapping2();
                          // } else {
                          //   this.message.error(
                          //     'Row Name Already Exist. Please Enter Other Row Name',
                          //     ''
                          //   );
                          //   this.loadingRecords = false;
                          // }
                        }
                      } else {
                        this.message.error('Information Not Saved', '');
                        this.loadingRecords = false;
                      }
                    });
                }

                // } else {
                //   this.message.error(
                //     'Row Name Already Exist. Please Enter Other Row Name',
                //     ''
                //   );
                //   this.loadingRecords = false;
                // }
              }
            }
          } else {
            datatocheck = [];
          }
        });
    }
  }
  drawerTitle!: string;
  drawerVisible1: boolean = false;

  alphaOnly(event: any) {
    event = event ? event : window.event;

    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }

    // Convert to uppercase

    var char = String.fromCharCode(charCode).toUpperCase();

    var target = event.target as HTMLInputElement;

    var currentValue = target.value || '';

    var selectionStart = target.selectionStart || 0;

    var selectionEnd = target.selectionEnd || 0;

    // Update the input value with uppercase character

    target.value =
      currentValue.substring(0, selectionStart) +
      char +
      currentValue.substring(selectionEnd);

    // Update ngModel

    this.data.ROW_NAME = target.value;

    // Prevent the default action

    event.preventDefault();

    return false;
  }

  edit(data: Theatrelayoutmapping2): void {
    this.data = Object.assign({}, data);
    if (!this.isShowWiseLayout) {
      this.api
        .getallTheatrelayoutmapping(
          0,
          0,
          '',
          'desc',
          ' AND THEATRE_LAYOUT_MAPPING_ID =' +
            this.layoutbutton +
            ' AND ID!=' +
            data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.layoutbuttonDataList1 = data['data'];
          }
        });
    } else {
      this.api
        .getallshowlayoutmapping(
          0,
          0,
          '',
          'desc',
          ' AND SHOW_ID =' +
            this.masterid +
            ' AND THEATRE_LAYOUT_MAPPING_ID  =' +
            this.layoutbutton +
            ' AND ID!=' +
            data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.layoutbuttonDataList1 = data['data'];
          }
        });
    }
  }

  isVisible = false;
  isOkLoading = false;
  dislabe: boolean = false;
  showModal(): void {
    this.Imgurldata = '';

    this.isVisible = true;
    if (!this.isShowWiseLayout) {
      this.api
        .getlayoutgroupnameseatimage(this.layoutmapId, this.theaterId)
        .subscribe((data) => {
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
    this.Imgurldata = '';
    this.isVisible = false;
  }

  close(): void {
    this.layoutbutton = false;
    this.drawerClose();
  }
  close1(): void {
    this.drawerVisible1 = false;
    this.drawerClose1();
  }

  // drawerClose(): void {
  //   this.search();
  //   this.drawerVisible = false;
  // }

  get closeCallback1() {
    return this.close1.bind(this);
  }

  isStarted = false;
  DELETE_CHECKED: any;
  // deletebooking(data: any) {
  //   this.loadingRecords = true;
    

  //   if (!this.isShowWiseLayout) {
  //     this.api
  //       .getmaster(0, 0, '', '', 'AND THEATRE_ID = ' + this.theaterId)
  //       .subscribe((data1: any) => {
  //         this.allMaster = data1['data'];

  //         for (let i = 0; i < this.allMaster.length; i++) {
  //           if (this.allMaster[i]['BOOKING_STATUS'] == 'S') {
  //             this.isStarted = true;
  //           } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BF') {
  //             this.isStarted = true;
  //           } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BS') {
  //             this.isStarted = true;
  //           }
  //         }
  //         if (this.isStarted == false) {
  //           this.api
  //             .deleteTheatreSeatBulk({
  //               THEATRE_LAYOUT_MAPPING_ID: this.layoutbutton,
  //               IDS: this.selectedIds.toString(),
  //             })
  //             .subscribe((successCode) => {
  //               if (successCode.code == '200') {
  //                 this.message.success('Seat Layout Deleted Succesfully', '');
  //                 this.dislabe = true;
  //                 setTimeout(() => {
  //                   this.loadingRecords = true;
  //                   this.getData();
  //                 }, 2000);
  //               } else {
  //                 this.loadingRecords = false;

  //                 this.message.error('Failed to Store Information', '');
  //               }
  //             });
  //         } else {
  //           this.message.error(
  //             'This Show is Presenting on Screen We Cannot Delete the Seat ',
  //             ''
  //           );
  //           this.loadingRecords = false;
  //         }
  //       });
  //   } else {
  //     this.api
  //       .getmaster(
  //         0,
  //         0,
  //         '',
  //         '',
  //         'AND THEATRE_ID = ' + this.theaterId + ' AND ID=' + data.SHOW_ID
  //       )
  //       .subscribe((data1: any) => {
  //         this.allMaster = data1['data'];

  //         for (let i = 0; i < this.allMaster.length; i++) {
  //           if (this.allMaster[i]['BOOKING_STATUS'] == 'S') {
  //             this.isStarted = true;
  //           } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BF') {
  //             this.isStarted = true;
  //           } else if (this.allMaster[i]['BOOKING_STATUS'] == 'BS') {
  //             this.isStarted = true;
  //           }
  //         }
  //         if (this.isStarted == false) {
  //           this.api
  //             .deleteShowSeatBulk({
  //               THEATRE_LAYOUT_MAPPING_ID: this.layoutbutton,
  //               IDS: this.selectedIds.toString(),
  //               SHOW_ID: data.SHOW_ID,
  //             })
  //             .subscribe((successCode) => {
  //               if (successCode.code == '200') {
  //                 this.message.success('Seat Layout Deleted Succesfully', '');
  //                 this.dislabe = true;
  //                 setTimeout(() => {
  //                   this.loadingRecords = true;
  //                   this.getData();
  //                 }, 2000);
  //               } else {
  //                 this.loadingRecords = false;

  //                 this.message.error('Failed to Store Information', '');
  //               }
  //             });
  //         } else {
  //           this.message.error(
  //             'This Show is Presenting on Screen We Cannot Delete the Seat ',
  //             ''
  //           );
  //           this.loadingRecords = false;
  //         }
  //       });
  //   }
  // }

  deletebooking(data: any) {
    this.loadingRecords = true;
  
    // Check if all same name seats are selected
    const allRowsValid = this.validateSelectedSeats();
  
    if (!allRowsValid) {
      this.message.info(
        'Please select all seats from the same row before deletion.',
        ''
      );
      this.loadingRecords = false;
      return;
    }
  
    if (!this.isShowWiseLayout) {
      this.api
        .getmaster(0, 0, '', '', 'AND THEATRE_ID = ' + this.theaterId)
        .subscribe((data1: any) => {
          this.allMaster = data1['data'];
  
          for (let i = 0; i < this.allMaster.length; i++) {
            if (
              ['S', 'BF', 'BS'].includes(this.allMaster[i]['BOOKING_STATUS'])
            ) {
              this.isStarted = true;
            }
          }
          if (this.isStarted == false) {
            this.api
              .deleteTheatreSeatBulk({
                THEATRE_LAYOUT_MAPPING_ID: this.layoutbutton,
                IDS: this.selectedIds.toString(),
              })
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Seat Layout Deleted Successfully', '');
                  this.dislabe = true;
                  setTimeout(() => {
                    this.loadingRecords = true;
                    this.getData();
                  }, 2000);
                } else {
                  this.loadingRecords = false;
                  this.message.error('Failed to Store Information', '');
                }
              });
          } else {
            this.message.error(
              'This Show is Presenting on Screen. We Cannot Delete the Seat',
              ''
            );
            this.loadingRecords = false;
          }
        });
    } else {
      this.api
        .getmaster(
          0,
          0,
          '',
          '',
          'AND THEATRE_ID = ' + this.theaterId + ' AND ID=' + data.SHOW_ID
        )
        .subscribe((data1: any) => {
          this.allMaster = data1['data'];
  
          for (let i = 0; i < this.allMaster.length; i++) {
            if (
              ['S', 'BF', 'BS'].includes(this.allMaster[i]['BOOKING_STATUS'])
            ) {
              this.isStarted = true;
            }
          }
          if (this.isStarted == false) {
            this.api
              .deleteShowSeatBulk({
                THEATRE_LAYOUT_MAPPING_ID: this.layoutbutton,
                IDS: this.selectedIds.toString(),
                SHOW_ID: data.SHOW_ID,
              })
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Seat Layout Deleted Successfully', '');
                  this.dislabe = true;
                  setTimeout(() => {
                    this.loadingRecords = true;
                    this.getData();
                  }, 2000);
                } else {
                  this.loadingRecords = false;
                  this.message.error('Failed to Store Information', '');
                }
              });
          } else {
            this.message.error(
              'This Show is Presenting on Screen. We Cannot Delete the Seat',
              ''
            );
            this.loadingRecords = false;
          }
        });
    }
  }
  
  /**
   * Validate if all rows with the same name are selected
   */
  validateSelectedSeats(): boolean {
    const rowSeatMap: { [key: string]: number } = {};
    const selectedRowSeatMap: { [key: string]: number } = {};
  
    // Count total seats per row
    this.layoutbuttonDataList.forEach((row: any) => {
      const rowName = row.ROW_NAME;
      rowSeatMap[rowName] = (rowSeatMap[rowName] || 0) + 1;
    });
  
    // Count selected seats per row
    this.selectedIds.forEach((id: any) => {
      const row = this.layoutbuttonDataList.find(
        (item: any) => item.ID === id
      );
      if (row) {
        selectedRowSeatMap[row.ROW_NAME] =
          (selectedRowSeatMap[row.ROW_NAME] || 0) + 1;
      }
    });
  
    // Validate if all seats per row are selected
    for (const rowName in rowSeatMap) {
      if (
        selectedRowSeatMap[rowName] !== undefined &&
        selectedRowSeatMap[rowName] !== rowSeatMap[rowName]
      ) {
        return false; // Mismatch in row seat count
      }
    }
  
    return true; // All rows are fully selected
  }
  
  resetDrawer(form11: NgForm) {
    this.data = new Theatrelayoutmapping2();
    form11.form.markAsPristine();
    form11.form.markAsUntouched();
  }
  rowname: any;
  viewdatadisplay = [];
  datataa: any = [];
  datataa1: any = [];

  viewdata(data: Theatrelayoutmapping2) {
    this.drawerTitle = 'View data';

    this.endseatnumbar = data['END_SEAT_NUMBER'];
    this.rowname = data['ROW_NAME'];

    for (let i = 1; i <= this.endseatnumbar; i++) {
      this.datataa = i;
      this.datataa1.push(this.datataa);
    }

    this.drawerVisible1 = true;
  }

  canDelete = false; // To control the delete button's state

  onRowSelectionChange() {
    // Update the DELETE_CHECKED list
    this.layoutbuttonDataList
      .filter((row: any) => row.checked)
      .map((row: any) => row.ID);

    // Enable or disable the delete button
    this.canDelete = this.DELETE_CHECKED.length > 0;
  }

  // allChecked = false;
  // indeterminate = true;
  // updateAllChecked(): void {
  //   this.indeterminate = false;
  //   if (this.allChecked) {
  //     this.layoutbuttonDataList = this.layoutbuttonDataList.map((item: any) => ({
  //       ...item,
  //       checked: true
  //     }));
  //   } else {
  //     this.layoutbuttonDataList = this.layoutbuttonDataList.map((item: any) => ({
  //       ...item,
  //       checked: false
  //     }));
  //   }}
  //   updateSingleChecked(): void {
  //     if (this.layoutbuttonDataList.every((item: { checked: any; }) => !item.checked)) {
  //       this.allChecked = false;
  //       this.indeterminate = false;
  //     } else if (this.layoutbuttonDataList.every((item: { checked: any; }) => item.checked)) {
  //       this.allChecked = true;
  //       this.indeterminate = false;
  //     } else {
  //       this.indeterminate = true;
  //     }
  //   }

  allChecked = false;
  indeterminate = false;

  // Select/Deselect All Rows
  // updateAllChecked(): void {

  //   this.indeterminate = false;

  //   // Update the checked status for all items
  //   this.layoutbuttonDataList = this.layoutbuttonDataList.map((item: any) => ({
  //     ...item,
  //     checked: this.allChecked,
  //   }));

  //   if (this.allChecked == true) {
  //     // Push all valid IDs into selectedIds
  //     this.selectedIds = this.layoutbuttonDataList
  //       .filter((item: any) => item.id !== undefined) // Ensure valid IDs
  //       .map((item: any) => item.id);
  //   } else {
  //     // Clear the selectedIds array
  //     this.selectedIds = [];
  //   }

  // }

  updateAllChecked(): void {
    this.indeterminate = false; // Reset indeterminate state

    if (this.allChecked) {
      // If "Select All" is checked, collect all IDs into selectedIds
      this.selectedIds = [];
      this.layoutbuttonDataList.forEach((item: any) => {
        item.checked = true;
        if (item.ID !== undefined && !this.selectedIds.includes(item.ID)) {
          this.selectedIds.push(item.ID);
        }
      });
    } else {
      // If "Select All" is unchecked, clear selectedIds
      this.layoutbuttonDataList.forEach((item: any) => {
        item.checked = false;
      });
      this.selectedIds = [];
    }
  }

  // Update Select All checkbox based on individual selection
  selectedIds: any[] = []; // Array to store selected IDs

  updateSingleChecked(event: boolean, i: any): void {
    if (event) {
      // Add ID to the array if not already present
      if (!this.selectedIds.includes(i)) {
        this.selectedIds.push(i);
      }
    } else {
      // Remove ID from the array
      this.selectedIds = this.selectedIds.filter((id) => id !== i);
    }

    // Update the select all and indeterminate states
    const allChecked = this.layoutbuttonDataList.every(
      (item: { checked: any }) => item.checked == true
    );
    const anyChecked = this.layoutbuttonDataList.some(
      (item: { checked: any }) => item.checked == true
    );

    this.allChecked = allChecked;
    this.indeterminate;
  }

  // Delete Selected Rows
  deleteSelectedRows(): void {
    const selectedRows = this.layoutbuttonDataList.filter(
      (item: { checked: any }) => item.checked
    );
    if (selectedRows.length === 0) {
      this.message.warning('Please select at least one row to delete', '');
      return;
    }

    // Perform delete action for each selected row
    selectedRows.forEach((row: any) => {
      this.deletebooking(row);
    });

    // Remove the deleted rows from the list
    this.layoutbuttonDataList = this.layoutbuttonDataList.filter(
      (item: { checked: any }) => !item.checked
    );

    this.allChecked = false;
    this.indeterminate = false;
  }

  cancel(){}
}
