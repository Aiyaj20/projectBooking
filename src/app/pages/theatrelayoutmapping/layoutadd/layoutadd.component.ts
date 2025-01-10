import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Theatremastercl } from 'src/app/Models/groupactivitylist';
import { SeatLayoutMapping } from 'src/app/Models/seatlayoutmapping';
import { Theatrelayoutmapping } from 'src/app/Models/theatrelayoutmapping';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-layoutadd',
  templateUrl: './layoutadd.component.html',
  styleUrls: ['./layoutadd.component.css']
})
export class LayoutaddComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: Theatrelayoutmapping = new Theatrelayoutmapping;
  @Input()
  dataList:any[]=[];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;
  theatremaster:Theatremastercl[]=[];
  layout:SeatLayoutMapping[]=[];

  // namepatt = /[a-zA-Z][a-zA-Z ]+/;
  namepatt = /^([^0-9]*)$/;
  // pinpatt1 = /([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/

  constructor(private api: ClientmasterService,
    private message: NzNotificationService) { }

  ngOnInit(): void {
    this.loadtheatremaster();
    this.loadlayout();
  }
  // For Accepting Only Alphabits/ Character
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

  //Document Type master
  loadtheatremaster(){
    this.api.getAllThearemaster(0,0,'',''," ").subscribe(data =>{
      this.theatremaster=data['data'];
    },err => {
      console.log(err);
      this.isSpinning=false;
    });
  }

  loadlayout(){
    
    this.api.getAllSeatlayoutgrpnames(0,0,'',''," ").subscribe(data =>{
      this.layout=data['data'];
    },err => {
      console.log(err);
      this.isSpinning=false;
    });
  }

  close(): void {
    this.drawerClose();
  }
  save(addNew: boolean,documentMasterPage: NgForm) : void{
    this.isOk = true;
    if(this.data.THEATRE_ID <= 0  && this.data.LAYOUT_ID <= 0  && this.data.DEFAULT_RATE <= 0)
    {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    }
   else if(this.data.THEATRE_ID==null || this.data.THEATRE_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Theater Name', '');
    }
    else if(this.data.LAYOUT_ID==null || this.data.LAYOUT_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Layout Name', '');
    }

    else if (this.data.DEFAULT_RATE == null || this.data.DEFAULT_RATE <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Default Rate', '');
    }
   
   
    if (this.isOk) {
      this.isSpinning = true;
      {
          if (this.data.ID) {
            this.api.updateTheatrelayout(this.data).subscribe((successCode) => {
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
            this.api.createTheatrelayout(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(documentMasterPage);
                  // this.data = new Theatrelayoutmapping();
                  this.api.getallTheatrelayout(0, 0, 'SEQUENCE_NO', 'desc', '').subscribe(
                    (data) => {
                    // if (data['count'] == 0) {
                    //   this.data.SEQUENCE_NO = 1;
                    // } else {
                    //   this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
                    // }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
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
  resetDrawer(documentMasterPage: NgForm) {
    // this.data = new Theatrelayoutmapping();
    documentMasterPage.form.markAsPristine();
    documentMasterPage.form.markAsUntouched();
  }

}
