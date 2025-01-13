import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { CasteMaster } from 'src/app/Models/CasteMaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-add-caste',
  templateUrl: './add-caste.component.html',
  styleUrls: ['./add-caste.component.css']
})
export class AddCasteComponent implements OnInit {



  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: CasteMaster = new CasteMaster();

  @Input() InupuDisabled: boolean = false;
  @Output() dataUpdated: EventEmitter<void> = new EventEmitter<void>(); // Emit event to parent when data is updated

  
  imgUrl = appkeys.retriveimgUrl;
  isSpinning = false;
  isOk = true;
  fileURL: any;

  constructor(
    private message: NzNotificationService,
    private api: ClientmasterService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}
  resetDrawer(websitebannerPage: NgForm) {
    this.data=new CasteMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();

  }
  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    if (
      !this.data.NAME ||
      !this.data.NICKNAME ||
      !this.data.DOB ||
      !this.data.BIRTHPLACE ||
      !this.data.SEQUENCE_NUMBER ||
      !this.data.PROFILE_IMAGE
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
      return;
    }

    if (!this.data.NAME) {
      this.isOk = false;
      this.message.error('Please Enter Name.', '');
    } else if (!this.data.NICKNAME) {
      this.isOk = false;
      this.message.error('Please Enter Nickname.', '');
    } else if (!this.data.BIRTHPLACE) {
      this.isOk = false;
      this.message.error('Please Enter Birth Place.', '');
    } else if (!this.data.SEQUENCE_NUMBER || this.data.SEQUENCE_NUMBER === 0) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    } else if (!this.data.DESCRIPTION) {
      this.isOk = false;
      this.message.error('Please Enter Description.', '');
    } else {
      this.isSpinning = true;
      this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');

      if (this.data.ID) {
        this.api.updateCastemaster(this.data).subscribe((successCode) => {
          this.handleApiResponse(successCode, addNew, websitebannerPage);
          this.drawerClose()
        });
      } else {
        this.api.createCastemaster(this.data).subscribe((successCode) => {
          this.handleApiResponse(successCode, addNew, websitebannerPage);
          this.drawerClose()
        });
      }
    }
  }

  handleApiResponse(successCode: any, addNew: boolean, form: NgForm) {
    if (successCode.code == '200') {
      this.message.success('Information Saved Successfully...', '');
      if (!addNew) this.drawerClose();
      else {
        this.resetForm(form);
        this.api.getCasteMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(
          (data) => {
            if (data['count'] == 0) {
              this.data.SEQUENCE_NUMBER = 1;
            } else {
              this.data.SEQUENCE_NUMBER = data['data'][0]['SEQUENCE_NUMBER'] + 1;
            }
          },
          (err) => {
            console.error(err);
          }
        );
      }
    } else {
      this.message.error('Failed To Save Information...', '');
    }
    this.isSpinning = false;
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.data = new CasteMaster();
    this.fileURL = null;
  }

  onFileSelected(event: any) {
    let imgs = new Image();
    let isLtsize = false;
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    imgs.onload = () => {
      const file = event.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
        if (imgs.height === 378 && imgs.width === 222) {
          this.fileURL = <File>file;
        } else {
          this.message.error('Please select an image with correct dimensions.', '');
          this.fileURL = null;
          this.data.PROFILE_IMAGE = '';
        }
      } else {
        this.message.error('Please select only JPEG/ JPG/ PNG file.', '');
        this.fileURL = null;
        this.data.PROFILE_IMAGE = '';
      }
    };
  }

  onFileSelected1(event: any) {
    const file = event.target.files[0];
    if (!file.type.includes('image/')) {
      this.message.error('Please select only JPEG/ JPG/ PNG file type.', '');
      this.data.PROFILE_IMAGE = '';
    } else {
      this.handleImageFile(file);
    }
  }

  handleImageFile(file: File) {
    const reader = new FileReader();
    const imgs = new Image();
    imgs.src = window.URL.createObjectURL(file);

    imgs.onload = () => {
      if (this.validateImageDimensions(imgs)) {
        this.readImageFile(file, reader);
      } else {
        this.message.error('Image size must be between 370px to 400px height and 220px to 250px width.', '');
        this.data.PROFILE_IMAGE = '';
      }
    };
  }

  validateImageDimensions(img: HTMLImageElement): boolean {
    return img.height >= 370 && img.height <= 400 && img.width >= 220 && img.width <= 250;
  }
image:any;
  readImageFile(file: File, reader: FileReader) {
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.image = reader.result as string;
      const fileName = this.generateFileName(file);
      this.data.PROFILE_IMAGE = fileName;
    };
  }

  generateFileName(file: File): string {
    const number = Math.floor(100000 + Math.random() * 900000);
    const fileExt = file.name.split('.').pop();
    const date = this.datePipe.transform(new Date(), 'yyyyMMdd');
    return date ? `${date}${number}.${fileExt}` : '';
  }

  removeImage() {
    this.data.PROFILE_IMAGE = '';
    this.fileURL = '';
    this.image = '';
  }

  selectedImageName: string | null = null;
  selectedImageUrl: string | null = null;

  selectImage() {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    if (imageInput) {
      imageInput.click();
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedImageName = file.name;
      this.data.PROFILE_IMAGE = file.name;
      this.previewImage(file);
    }
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  deleteImage() {
    this.selectedImageName = null;
    this.selectedImageUrl = null;
  }
}
