import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TheaterMasterr } from 'src/app/Models/theatermaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-add-theater-master',
  templateUrl: './add-theater-master.component.html',
  styleUrls: ['./add-theater-master.component.css'],
})
export class AddTheaterMasterComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: TheaterMasterr = new TheaterMasterr();
  @Input()
  drawerVisible: boolean = false;
  @Input()
  pdfurl=''
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  city: TheaterMasterr[] = [];

  //Google map
  latitude: number = 0;
  longitude: number = 0;
  zoom = 12;
  // @Input() center: google.maps.LatLngLiteral={ lat: 16.867634, lng: 74.570389 };
  // markerOptions: google.maps.MarkerOptions = { draggable: true };
  // @Input() markerPositions: google.maps.LatLngLiteral ={ lat: 16.867634, lng: 74.570389 };

  // addMarker2(event: any) {
  //   this.markerPositions = event.latLng.toJSON();
  //   this.latitude = this.markerPositions.lat;
  //   this.longitude = this.markerPositions.lng;

  //   this.data.LATITUDE = this.latitude.toString();
  //   this.data.LONGITUDE   = this.longitude.toString();
  // }

  // googleMapPointer() {
  //   this.center = {
  //     lat: Number(this.data.LATITUDE),
  //     lng: Number(this.data.LONGITUDE  ),
  //   }
  //   this.markerPositions = { lat: Number(this.data.LATITUDE), lng: Number(this.data.LONGITUDE  ) };
  // }
  //////
  userId: any;
  theatreId: any;
  cityId: any = [];

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
    // this.citywiseshowreports();
  }
  openPdfInNewTab(pdfUrl:any) {
    // Open the PDF in a new tab/window
    window.open(pdfUrl, '_blank');
}
  temp: any;
  citywiseshowreports() {
    if (this.cityId.length > 0) {
      this.api
        .getCityMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND ID in(' + this.cityId + ')'
        )
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
      this.api
        .getCityMaster(0, 0, '', '', ' AND STATUS = 1 AND ID in(' + 0 + ')')
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
  theater: any = [];

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

  getcity() {
    this.isSpinning = true;
    this.api.getCityMaster(0, 0, '', '', ' ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.city = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  close(): void {
    this.drawerClose();
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ////

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new TheaterMasterr();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
    this.fileURL = '';
    this.image = '';
    this.getcity();
  }
  event1: any;
  image: any = '';
  fileURL: any;
  imgUrl = appkeys.retriveimgUrl;
  
  onFileSelected1(event: any) {
    const file = event.target.files[0];
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validApplicationTypes = ['application/pdf'];


    
    if (!validImageTypes.includes(fileType) && !validApplicationTypes.includes(fileType)) {
        this.message.error('Please select only JPEG/ JPG/ PNG/ PDF file type.', '');
        this.data.ACTUAL_LAYOUT_IMAGE = '';
        return;
    }

    if (validImageTypes.includes(fileType)) {
        const reader = new FileReader();
        let imgs = new Image();
        imgs.src = window.URL.createObjectURL(file);

        imgs.onload = () => {
            this.fileURL = <File>file;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.image = reader.result as string;
            };
            this.generateFileName();
        };
    } else if (validApplicationTypes.includes(fileType)) {
        this.fileURL = <File>file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.image = reader.result as string;
        };
        this.generateFileName();
    }
}

generateFileName() {
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL.name.split('.').pop();
    var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    var url = d == null ? '' : d + number + '.' + fileExt;
    this.data.ACTUAL_LAYOUT_IMAGE = url;
}

  removeImage() {
    this.data.ACTUAL_LAYOUT_IMAGE = '';
    this.fileURL = '';
    this.image = '';
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.CITY_ID == 0 &&
      this.data.NAME == '' &&
      this.data.ADDRESS == '' &&
      (this.data.ACTUAL_LAYOUT_IMAGE == ''
      && this.data.ACTUAL_LAYOUT_IMAGE != null
      )
      // this.data.LONGITUDE == ""  &&
      // this.data.LATITUDE == ""
      // this.data.SEQUENCE_NUMBER == 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
      this.isOk = false;
      this.message.error(' Please Select City Name', '');
    } else if (this.data.NAME == null || this.data.NAME == '') {
      this.isOk = false;
      this.message.error(' Please Enter Theater Name', '');
    } else if (this.data.ADDRESS == null || this.data.ADDRESS == '') {
      this.isOk = false;
      this.message.error(' Please Enter Theater Address', '');
    }

    // else if (this.data.LONGITUDE == null || this.data.LONGITUDE == "") {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Longitude', "");

    // }
    // else if (this.data.LATITUDE == null || this.data.LATITUDE == "") {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Lattitude', "");

    // }
    else if (
      this.data.ACTUAL_LAYOUT_IMAGE == null ||
      this.data.ACTUAL_LAYOUT_IMAGE == '' 
    ) {
      this.isOk = false;
      this.message.error(' Please Select Actual Layout Image', '');
    } else if (
      this.data.SEQUENCE_NUMBER == undefined ||
      this.data.SEQUENCE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    }

    // create update

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.fileURL != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileURL.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          if (
            this.data.ACTUAL_LAYOUT_IMAGE != undefined &&
            this.data.ACTUAL_LAYOUT_IMAGE.trim() != ''
          ) {
            var arr = this.data.ACTUAL_LAYOUT_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.api
            .onUpload('actualTheatreLayoutImage', this.fileURL, url)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.data.ACTUAL_LAYOUT_IMAGE = url;
                // appkeys.retriveimgUrl + 'AlbamImage/' + url;
                if (this.data.ID) {
                  this.api.updateTheatreMaster(this.data).subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success('Information Changed Successfully...', '');
                      if (!addNew) this.drawerClose();
                      this.isSpinning = false;
                    } else {
                      this.message.error('Information Has Not Changed...', '');
                      this.isSpinning = false;
                    }
                  });
                } else {
                  this.api.createTheatreMaster(this.data).subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success('Information Entered Successfully...', '');
                      if (!addNew) this.drawerClose();
                      else {
                        this.data = new TheaterMasterr();
                        this.resetDrawer(websitebannerPage);
                      }
                      this.isSpinning = false;
                    } else {
                      this.message.error('Failed To Fill Information...', '');
                      this.isSpinning = false;
                    }
                  });
                }
              } else {
                this.message.error('Faild To Store Information', '');
                this.isSpinning = false;
              }
            });
        } else if (this.data.ACTUAL_LAYOUT_IMAGE == null || this.data.ACTUAL_LAYOUT_IMAGE == '') {
          this.message.error('Please Select Image', '');
          this.isSpinning = false;
        } else
        if (this.data.ID) {
          this.api.updateTheatreMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createTheatreMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Entered Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new TheaterMasterr();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
}
