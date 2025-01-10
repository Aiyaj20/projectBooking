import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DistributeMaster } from 'src/app/Models/distributeMaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-add-distribute-master',
  templateUrl: './add-distribute-master.component.html',
  styleUrls: ['./add-distribute-master.component.css'],
})
export class AddDistributeMasterComponent implements OnInit {
  @Input()
  data: DistributeMaster = new DistributeMaster();
  @Input()
  drawerClose!: Function;
  @Input()
  drawerVisible: boolean = false;
  screenwidth: any;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  @Input() DataList: any=[];
  passwordVisible = false;
  

  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private api: ClientmasterService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // this.gettheatername();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  gettheatername() {
    this.api
      .getMappedTheatre(0, 0, '', '', '' )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DataList = data['data'];
          } else {
            this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  close(websitebannerPage: NgForm): void {
    this.drawerClose();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    
    if (
      this.data.NAME.trim() == '' &&
      this.data.EMAIL_ID == undefined &&
      this.data.MOBILE_NUMBER == undefined &&
      this.data.THEATRE_ID==undefined &&
      this.data.ADDRESS==undefined 
     
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Distributor Name.', '');
    } else if (this.data.EMAIL_ID == undefined || this.data.EMAIL_ID == '') {
      this.isOk = false;
      this.message.error(' Please Enter Email Id', '');
    } else if (this.data.MOBILE_NUMBER == undefined || this.data.MOBILE_NUMBER == '') {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (!this.mobpattern.test(this.data.MOBILE_NUMBER.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number', '');      
    } 
     else if (this.data.THEATRE_ID == null || this.data.THEATRE_ID==undefined) {
      this.isOk = false;
      this.message.error(' Please Select Theater Name', '');
    }
    else if (this.data.PASSWORD == null || this.data.PASSWORD==undefined) {
      this.isOk = false;
      this.message.error(' Please Enter password', '');
    } else if (
      this.data.ADDRESS == null ||
      this.data.ADDRESS== undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Address', '');
    } 
    

    if (this.isOk) {
      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' 
       
      ) {
        this.data.ADDRESS = ' ';
      } else {
        this.data.ADDRESS = this.data.ADDRESS;
      }
      if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '' 
        
      ) {
        this.data.EMAIL_ID = null;
      } else {
        this.data.EMAIL_ID = this.data.EMAIL_ID;
      }
      
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateDistributedMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              }
            }  else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api
            .createDistrubutedMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  websitebannerPage.form.reset();
                } else {
                  this.data = new DistributeMaster();
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

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new DistributeMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
    this.gettheatername();
  }
}
