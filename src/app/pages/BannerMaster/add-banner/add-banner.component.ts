import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { BannerMaster } from 'src/app/Models/BannerMaster';
import { CasteMaster } from 'src/app/Models/CasteMaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {
  @Input()
    data: BannerMaster = new BannerMaster();
    @Input()
    drawerClose!: Function;
    @Input()
    drawerVisible: boolean = false;
    @Input()
    InupuDisabled:boolean = false;
    imgUrl = appkeys.retriveimgUrl;
  isSpinning = false;
  isOk = true;
  fileURL: any;
   constructor(
     private message: NzNotificationService,
     private api: ClientmasterService,
     private datePipe: DatePipe
   ) {}

  ngOnInit(): void {
  }
  
  close(): void {
    this.drawerClose();
  }


    save(addNew: boolean, websitebannerPage: NgForm): void {
      
      this.isSpinning = false;
      this.isOk = true;
  
      
  
      // if (
      //   this.data.NAME == '' &&
      //   this.data.CAST_NAMES.length == 0 &&
      //   this.data.FROM_DATE == undefined &&
      //   this.data.SHORT_CODE == undefined &&
      //   this.data.TO_DATE == undefined &&
      //   this.data.DRAMA_IMAGE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Fill All The Required Fields ', '');
      // } else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
      //   this.isOk = false;
      //   this.message.error(' Please Select City Name.', '');
      // }else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Drama Name.', '');
      // } else if (this.data.CAST_NAMES == null || this.data.CAST_NAMES == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Cast Name', '');
      // }
  
      // // else if (this.data.DESCRIPTION == null || this.data.DESCRIPTION == "") {
      // //   this.isOk = false;
      // //   this.message.error(' Please Enter  Description', "");
  
      // // }
      // else if (this.data.FROM_DATE == null || this.data.FROM_DATE == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Select From Date', '');
      // } else if (this.data.TO_DATE == null || this.data.TO_DATE == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Select To Date', '');
      // } else if (
      //   this.data.SHORT_CODE == null ||
      //   this.data.SHORT_CODE.trim() == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Short Code', '');
      // } else if (
      //   this.data.SEQUENCE_NUMBER == undefined ||
      //   this.data.SEQUENCE_NUMBER <= 0
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Sequence Number.', '');
      // } else if (this.data.DRAMA_IMAGE == null || this.data.DRAMA_IMAGE == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Select Poster Image', '');
      // }
  
      // create update
  
      // if (this.isOk) {
      //   this.data.CAST_NAMES = this.data.CAST_NAMES.toString();
  
      //   this.isSpinning = true;
      //   this.data.FROM_DATE = this.datePipe.transform(
      //     this.data.FROM_DATE,
      //     'yyyy-MM-dd'
      //   );
      //   this.data.TO_DATE = this.datePipe.transform(
      //     this.data.TO_DATE,
      //     'yyyy-MM-dd'
      //   );
      //   if (this.fileURL != null) {
      //     var number = Math.floor(100000 + Math.random() * 900000);
      //     var fileExt = this.fileURL.name.split('.').pop();
      //     var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      //     var url = '';
      //     url = d == null ? '' : d + number + '.' + fileExt;
      //     if (
      //       this.data.DRAMA_IMAGE != undefined &&
      //       this.data.DRAMA_IMAGE.trim() != ''
      //     ) {
      //       var arr = this.data.DRAMA_IMAGE.split('/');
      //       if (arr.length > 1) {
      //         url = arr[5];
      //       }
      //     }
      //     this.api
      //       .onUpload('dramaImages/', this.fileURL, url)
      //       .subscribe((successCode) => {
      //         if (successCode.code == '200') {
      //           this.data.DRAMA_IMAGE = url;
      //           // appkeys.retriveimgUrl + 'AlbamImage/' + url;
      //           if (this.data.ID) {
      //             this.api
      //               .updateDramaMaster(this.data)
      //               .subscribe((successCode) => {
      //                 if (successCode.code == '200') {
      //                   this.message.success(
      //                     'Information Updated Successfully...',
      //                     ''
      //                   );
      //                   if (!addNew) this.drawerClose();
      //                   this.isSpinning = false;
      //                 } else {
      //                   this.message.error('Information Not Updated...', '');
      //                   this.isSpinning = false;
      //                 }
      //               });
      //           } else {
      //             this.api
      //               .createDramaMaster(this.data)
      //               .subscribe((successCode) => {
      //                 // if (successCode.code == '200') {
      //                 //   this.message.success('Information Updated Successfully', '');
      //                 //   if (!addNew) this.drawerClose();
      //                 //   else {
      //                 //     this.resetDrawer(formdata);
      //                 //     this.data = new SuccessStory();
      //                 //   }
      //                 //   this.isSpinning = false;
      //                 // } else {
      //                 //   this.message.error('Information Not Saved', '');
      //                 //   this.isSpinning = false;
      //                 // }
      //                 if (successCode.code == '200') {
      //                   this.message.success(
      //                     'Information Saved Successfully...',
      //                     ''
      //                   );
      //                   if (!addNew) {
      //                     this.drawerClose();
      //                   } else {
      //                     this.resetDrawer(websitebannerPage);
      //                     this.data = new DramaMAsterr();
      //                     this.api
      //                       .getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
      //                       .subscribe(
      //                         (data) => {
      //                           if (data['count'] == 0) {
      //                             this.data.SEQUENCE_NUMBER = 1;
      //                           } else {
      //                             this.data.SEQUENCE_NUMBER =
      //                               data['data'][0]['SEQUENCE_NUMBER'] + 1;
      //                           }
      //                         },
      //                         (err) => {
      //                           console.log(err);
      //                         }
      //                       );
      //                     if (this.userId != 1) {
      //                       this.theaterList();
      //                     } else {
      //                       this.api
      //                         .getCityMaster(0, 0, '', '', ' AND STATUS = 1')
      //                         .subscribe(
      //                           (data) => {
      //                             if (data['code'] == 200) {
      //                               this.city = data['data'];
      //                             }
      //                           },
      //                           (err) => {
      //                             console.log(err);
      //                           }
      //                         );
      //                     }
      //                   }
      //                   this.isSpinning = false;
      //                 } else {
      //                   this.message.error('Information Not Saved...', '');
      //                   this.isSpinning = false;
      //                 }
      //               });
      //           }
      //         } else {
      //           this.message.error('Faild To Store Information', '');
      //           this.isSpinning = false;
      //         }
      //       });
      //   } else if (this.data.DRAMA_IMAGE == null || this.data.DRAMA_IMAGE == '') {
      //     this.message.error('Please Select Image', '');
      //     this.isSpinning = false;
      //   } else {
      //     if (this.data.ID) {
      //       this.api.updateDramaMaster(this.data).subscribe((successCode) => {
      //         if (successCode.code == '200') {
      //           this.message.success('Information Updated Successfully', '');
      //           if (!addNew) this.drawerClose();
      //           this.isSpinning = false;
      //         } else {
      //           this.message.error('Faild To Store Information', '');
      //           this.isSpinning = false;
      //         }
      //       });
      //     } else {
      //       this.api.createDramaMaster(this.data).subscribe((successCode) => {
      //         if (successCode.code == '200') {
      //           this.message.success('Information Saved Successfully...', '');
      //           if (!addNew) {
      //             this.drawerClose();
      //           } else {
      //             this.resetDrawer(websitebannerPage);
      //             this.data = new DramaMAsterr();
      //             this.api
      //               .getdramaMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
      //               .subscribe(
      //                 (data) => {
      //                   if (data['count'] == 0) {
      //                     this.data.SEQUENCE_NUMBER = 1;
      //                   } else {
      //                     this.data.SEQUENCE_NUMBER =
      //                       data['data'][0]['SEQUENCE_NUMBER'] + 1;
      //                   }
      //                 },
      //                 (err) => {
      //                   console.log(err);
      //                 }
      //               );
      //             if (this.userId != 1) {
      //               this.theaterList();
      //             } else {
      //               this.api
      //                 .getCityMaster(0, 0, '', '', ' AND STATUS = 1')
      //                 .subscribe(
      //                   (data) => {
      //                     if (data['code'] == 200) {
      //                       this.city = data['data'];
      //                     }
      //                   },
      //                   (err) => {
      //                     console.log(err);
      //                   }
      //                 );
      //             }
      //           }
      //           this.isSpinning = false;
      //         } else {
      //           this.message.error('Faild To Store Information', '');
      //           this.isSpinning = false;
      //         }
      //       });
      //     }
      //   }
      // }
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
            this.data.IMAGE = '';
          }
        } else {
          this.fileURL = null;
          this.data.IMAGE = ' ';
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
    // event1: any;
    image: any = '';
    onFileSelected1(event: any) {
      if (!event.target.files[0].type.includes('image/')) {
        this.message.error('Please select only JPEG/ JPG/ PNG file type. ', '');
        
        this.data.IMAGE = '';
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
              this.data.IMAGE = '';
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
                  this.data.IMAGE=url
                  
                  // this.event1 = url;
                }
                
              } else {
                this.message.error(
                  'Please select only JPEG/ JPG/ PNG file type.',
                  ''
                );
                this.fileURL = null;
                this.data.IMAGE = '';
              }
            }
          } else {
            this.message.error(
              'Please select only JPEG/ JPG/ PNG file type.',
  
              ''
            );
            this.fileURL = null;
            this.data.IMAGE = '';
          }
        };
      }
    }

    removeImage() {
      this.data.IMAGE = '';
      this.fileURL = '';
      this.image = '';
    }
  
    selectedImageName: string | null = null;
    selectedImageUrl: string | null = null;
  
    // Trigger file input for image selection
    selectImage() {
      const imageInput = document.getElementById('imageInput') as HTMLInputElement;
      if (imageInput) {
        imageInput.click();
      }
    }
  
    // Handle the image selection event
    onImageSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
  
        // Set the selected image name
        this.selectedImageName = file.name;
  
        // Create a preview URL for the selected image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    // Clear the selected image
    deleteImage() {
      this.selectedImageName = null;
      this.selectedImageUrl = null;
    }

}
