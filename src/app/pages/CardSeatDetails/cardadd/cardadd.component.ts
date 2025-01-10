import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cardseatdetails } from 'src/app/Models/cardseatdetails';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-cardadd',
  templateUrl: './cardadd.component.html',
  styleUrls: ['./cardadd.component.css']
})
export class CardaddComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: Cardseatdetails = new Cardseatdetails;
  @Input()
  dataList:any[]=[];
  
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;

  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  // pinpatt1 = /([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/

  constructor(private api: ClientmasterService,
    private message: NzNotificationService,
    private datePipe: DatePipe) { }
  ngOnInit(): void {
  }
  
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
    return true;
  }

  omit(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
}

  close(): void {
    this.drawerClose();
  }
  save(addNew: boolean,LanguageMasterPage: NgForm) : void{
    this.isOk = true;
    if(this.data.CART_MASTER_ID <= 0  && this.data.ROW_NAME.trim()=='' && this.data.SEAT_NUMBER <= 0 && this.data.AMOUNTS <= 0)
    {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    }
   else if(this.data.CART_MASTER_ID==null || this.data.CART_MASTER_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Cart Master', '');
    }
    if(this.data.ROW_NAME.trim()=='' && this.data.ROW_NAME.trim()=='')
    {
      this.isOk = false;
      this.message.error('Please Enter Row Name', '');
    }
    else if (this.data.SEAT_NUMBER == null || this.data.SEAT_NUMBER <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Seat Number', '');
    }
    else if (this.data.AMOUNTS == null || this.data.AMOUNTS <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Amount', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
          if (this.data.ID) {
            this.api.updatecardseatdetails(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Not Updated', '');
                this.isSpinning = false;
              }
            });
          }
          else{
            this.api.createcardseatdetails(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Saved Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(LanguageMasterPage);
                  this.data = new Cardseatdetails();
                }
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

  resetDrawer(LanguageMasterPage: NgForm) {
    this.data = new Cardseatdetails();
    LanguageMasterPage.form.markAsPristine();
    LanguageMasterPage.form.markAsUntouched();
  }

}
