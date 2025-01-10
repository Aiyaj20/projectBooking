import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DramaMAsterr } from 'src/app/Models/daramamaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-add-drama',
  templateUrl: './add-drama.component.html',
  styleUrls: ['./add-drama.component.css'],
})
export class AddDramaComponent implements OnInit {
  today2 = new Date();
  @Input()
  drawerClose!: Function;
  @Input()
  InupuDisabled:boolean = false;
  @Input()
  data: DramaMAsterr = new DramaMAsterr();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  fileURL: any;
  imgUrl = appkeys.retriveimgUrl;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  @Input() list = [];

  city: DramaMAsterr[] = [];
  files: any;
  userId: any;
  theatreId: any;
  theater: any;

  
  constructor(
    private message: NzNotificationService,
    private api: ClientmasterService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.theatreId = sessionStorage.getItem('theatreId');
    if (this.userId != 1) {
      this.theaterList();
    } else {
      this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
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
  cityId: any = [];

  removeImage() {
    this.data.DRAMA_IMAGE = '';
    this.fileURL = '';
    this.image = '';
  }

  //Choose Image
  //   onFileSelected(event: any) {
    

  //     if (
  //       event.target.files[0].type == 'image/jpeg' ||
  //       event.target.files[0].type == 'image/jpg' ||
  //       event.target.files[0].type == 'image/png'
  //     ) {
  //       this.fileURL = <File>event.target.files[0];
  //     }
  //     if (event.target.files[0].size < 200 * 200) {/* Checking height * width*/ }
  //     if (event.target.files[0].size < 2000000) {/* checking size here - 2MB */ }
  // else {
  //       this.message.error('Please select only JPEG/ JPG/ PNG Files.', '');
  //       this.fileURL = null;
  //       this.data.DRAMA_IMAGE = '';
  //     }
  //   }

  //Choose Image

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (
        event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg'
      ) {
        if (event.target.files[0].size < 378 * 222) {
          /* Checking height * width*/
        }
        if (event.target.files[0].size < 2000000) {
        }
      }
    }
  }

  onFileSelected(event: any) {
    
    let imgs = new Image();
    let isLtsize = false;
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    imgs.onload = () => {
      
      if (
        event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png'
      ) {
        isLtsize = true;
        if (378 == imgs.height && imgs.width == 222) {
          this.fileURL = <File>event.target.files[0];
        } else {
          this.message.error('Please select only JPEG/ JPG/ PNG file.', '');
          this.fileURL = null;
          this.data.DRAMA_IMAGE = '';
        }
      } else {
        this.fileURL = null;
        this.data.DRAMA_IMAGE = ' ';
        this.message.error(
          'The image will not fit between the dimensions of ' +
            500 +
            ' ' +
            'px Height ' +
            ' And ' +
            ' ' +
            457 +
            ' px Width ',
          ''
        );
      }
    };
  }
  event1: any;
  image: any = '';

  onFileSelected1(event: any) {
    if (!event.target.files[0].type.includes('image/')) {
      this.message.error('Please select only JPEG/ JPG/ PNG file type. ', '');
      
      this.data.DRAMA_IMAGE = '';
    } else {
      const reader = new FileReader();
      let isLtsize = false;
      let imgs = new Image();
      imgs.src = window.URL.createObjectURL(event.target.files[0]);
      
      imgs.onload = () => {
        
        if (
          event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png'
        ) {
          if (
            imgs.height <= 400 &&
            imgs.height >= 370 &&
            imgs.width <= 250 &&
            imgs.width >= 220
          ) {
            isLtsize = true;
          }
          if (!isLtsize) {
            this.message.error(
              'The Selected Image size must between 370px to 400px height and 220px to 250px width.',
              ''
            );
            this.data.DRAMA_IMAGE = '';
          } else {
            if (
              event.target.files[0].type == 'image/jpeg' ||
              event.target.files[0].type == 'image/jpg' ||
              event.target.files[0].type == 'image/png'
            ) {
              this.fileURL = <File>event.target.files[0];
              const reader = new FileReader();
              if (event.target.files && event.target.files.length) {
                const [file] = event.target.files;
                reader.readAsDataURL(file);
                reader.onload = () => {
                  this.image = reader.result as string;
                };
                var number = Math.floor(100000 + Math.random() * 900000);
                
                var fileExt = this.fileURL.name.split('.').pop();
                
                var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
                
                var url = '';
                url = d == null ? '' : d + number + '.' + fileExt;
                this.data.DRAMA_IMAGE=url
                
                // this.event1 = url;
              }
              
            } else {
              this.message.error(
                'Please select only JPEG/ JPG/ PNG file type.',
                ''
              );
              this.fileURL = null;
              this.data.DRAMA_IMAGE = '';
            }
          }
        } else {
          this.message.error(
            'Please select only JPEG/ JPG/ PNG file type.',

            ''
          );
          this.fileURL = null;
          this.data.DRAMA_IMAGE = '';
        }
      };
    }
  }

  // onFileSelected2(event: any) {
  //   const reader = new FileReader();
  //   let isLtsize = false;
  //   let imgs = new Image();

  //   if (event.target.files.length == 0) {
  //     this.message.error('Please select a file.', '');
  //     return;
  //   }

  //   const file = event.target.files[0];
  //   if (!file.type.startsWith('image/')) {
  //     this.message.error('Please Select an Image File.', '');
  //     return;
  //   }

  //   imgs.src = window.URL.createObjectURL(file);
  

  //   imgs.onload = () => {
    
  //     if (imgs.height == 378 && imgs.width == 222) {
  //       isLtsize = true;
  //     } else if (!isLtsize) {
  //       this.message.error(
  //         'The Image will not fit between the dimensions of 378px Height And 222px Width',
  //         ''
  //       );
  //     } else {
  //       this.fileURL = <File>file;
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         this.image = reader.result as string;
  
  //       };

  //       var number = Math.floor(100000 + Math.random() * 900000);
  

  //       var fileExt = this.fileURL.name.split('.').pop();
  

  //       var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
  

  //       var url = '';
  //       url = d == null ? '' : d + number + '.' + fileExt;

  
  //       this.event1 = url;
  //     }
  //   };
  // }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new DramaMAsterr();
    this.fileURL = '';
    this.image = '';
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    
    this.isSpinning = false;
    this.isOk = true;

    

    if (
      this.data.NAME == '' &&
      this.data.CAST_NAMES.length == 0 &&
      this.data.FROM_DATE == undefined &&
      this.data.SHORT_CODE == undefined &&
      this.data.TO_DATE == undefined &&
      this.data.DRAMA_IMAGE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
      this.isOk = false;
      this.message.error(' Please Select City Name.', '');
    }else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Drama Name.', '');
    } else if (this.data.CAST_NAMES == null || this.data.CAST_NAMES == '') {
      this.isOk = false;
      this.message.error(' Please Enter Cast Name', '');
    }

    // else if (this.data.DESCRIPTION == null || this.data.DESCRIPTION == "") {
    //   this.isOk = false;
    //   this.message.error(' Please Enter  Description', "");

    // }
    else if (this.data.FROM_DATE == null || this.data.FROM_DATE == '') {
      this.isOk = false;
      this.message.error(' Please Select From Date', '');
    } else if (this.data.TO_DATE == null || this.data.TO_DATE == '') {
      this.isOk = false;
      this.message.error(' Please Select To Date', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Short Code', '');
    } else if (
      this.data.SEQUENCE_NUMBER == undefined ||
      this.data.SEQUENCE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    } else if (this.data.DRAMA_IMAGE == null || this.data.DRAMA_IMAGE == '') {
      this.isOk = false;
      this.message.error(' Please Select Poster Image', '');
    }

    // create update

    if (this.isOk) {
      this.data.CAST_NAMES = this.data.CAST_NAMES.toString();

      this.isSpinning = true;
      this.data.FROM_DATE = this.datePipe.transform(
        this.data.FROM_DATE,
        'yyyy-MM-dd'
      );
      this.data.TO_DATE = this.datePipe.transform(
        this.data.TO_DATE,
        'yyyy-MM-dd'
      );
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.DRAMA_IMAGE != undefined &&
          this.data.DRAMA_IMAGE.trim() != ''
        ) {
          var arr = this.data.DRAMA_IMAGE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
        this.api
          .onUpload('dramaImages/', this.fileURL, url)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.data.DRAMA_IMAGE = url;
              // appkeys.retriveimgUrl + 'AlbamImage/' + url;
              if (this.data.ID) {
                this.api
                  .updateDramaMaster(this.data)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success(
                        'Information Updated Successfully...',
                        ''
                      );
                      if (!addNew) this.drawerClose();
                      this.isSpinning = false;
                    } else {
                      this.message.error('Information Not Updated...', '');
                      this.isSpinning = false;
                    }
                  });
              } else {
                this.api
                  .createDramaMaster(this.data)
                  .subscribe((successCode) => {
                    // if (successCode.code == '200') {
                    //   this.message.success('Information Updated Successfully', '');
                    //   if (!addNew) this.drawerClose();
                    //   else {
                    //     this.resetDrawer(formdata);
                    //     this.data = new SuccessStory();
                    //   }
                    //   this.isSpinning = false;
                    // } else {
                    //   this.message.error('Information Not Saved', '');
                    //   this.isSpinning = false;
                    // }
                    if (successCode.code == '200') {
                      this.message.success(
                        'Information Saved Successfully...',
                        ''
                      );
                      if (!addNew) {
                        this.drawerClose();
                      } else {
                        this.resetDrawer(websitebannerPage);
                        this.data = new DramaMAsterr();
                        this.api
                          .getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
                          .subscribe(
                            (data) => {
                              if (data['count'] == 0) {
                                this.data.SEQUENCE_NUMBER = 1;
                              } else {
                                this.data.SEQUENCE_NUMBER =
                                  data['data'][0]['SEQUENCE_NUMBER'] + 1;
                              }
                            },
                            (err) => {
                              console.log(err);
                            }
                          );
                        if (this.userId != 1) {
                          this.theaterList();
                        } else {
                          this.api
                            .getCityMaster(0, 0, '', '', ' AND STATUS = 1')
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
                        }
                      }
                      this.isSpinning = false;
                    } else {
                      this.message.error('Information Not Saved...', '');
                      this.isSpinning = false;
                    }
                  });
              }
            } else {
              this.message.error('Faild To Store Information', '');
              this.isSpinning = false;
            }
          });
      } else if (this.data.DRAMA_IMAGE == null || this.data.DRAMA_IMAGE == '') {
        this.message.error('Please Select Image', '');
        this.isSpinning = false;
      } else {
        if (this.data.ID) {
          this.api.updateDramaMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Faild To Store Information', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createDramaMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Saved Successfully...', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.resetDrawer(websitebannerPage);
                this.data = new DramaMAsterr();
                this.api
                  .getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
                  .subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NUMBER = 1;
                      } else {
                        this.data.SEQUENCE_NUMBER =
                          data['data'][0]['SEQUENCE_NUMBER'] + 1;
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                if (this.userId != 1) {
                  this.theaterList();
                } else {
                  this.api
                    .getCityMaster(0, 0, '', '', ' AND STATUS = 1')
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
                }
              }
              this.isSpinning = false;
            } else {
              this.message.error('Faild To Store Information', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) < 0;
}
