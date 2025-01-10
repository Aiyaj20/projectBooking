import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Showlayoutrates } from 'src/app/Models/showlayoutrates';
import { Master } from 'src/app/Models/Show Master';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { SeatlayoutGroupNames } from 'src/app/Models/seatlayoutgroupname';

@Component({
  selector: 'app-showadd',
  templateUrl: './showadd.component.html',
  styleUrls: ['./showadd.component.css']
})
export class ShowaddComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: Showlayoutrates = new Showlayoutrates;
  @Input()
  dataList:any[]=[];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;

  seatlayoutgrpname: SeatlayoutGroupNames[] = [];

  namepatt = /^([^0-9]*)$/;

  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/

  constructor(private api: ClientmasterService,
    private message: NzNotificationService) { }
    show:Master[]=[]
  ngOnInit(): void {
    this.loadseatlayoutgrpname();
    
    this.api.getmaster(0, 0, '', '', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.show= data["data"]
      }
    }, err => {
      console.log(err);
    })
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
  // loadDocumentType(){
  //   this.api.getAllDocumentTypesMaster(0,0,'',''," AND IS_ACTIVE = 1").subscribe(data =>{
  //     this.documenttype=data['data'];
  //   },err => {
  //     console.log(err);
  //     this.isSpinning=false;
  //   });
  // }
  close(): void {
    this.drawerClose();
  }
  save(addNew: boolean,documentMasterPage: NgForm) : void{
    this.isOk = true;
    if(this.data.SHOW_MASTER_ID <= 0  && this.data.LAYOUT_ID <= 0  && this.data.TICKET_RATE <= 0 )
    {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    }
   else if(this.data.SHOW_MASTER_ID==null || this.data.SHOW_MASTER_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Show Name', '');
    }
    else if(this.data.LAYOUT_ID==null || this.data.LAYOUT_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Layout Name', '');
    }
    else if(this.data.TICKET_RATE==null || this.data.TICKET_RATE==0)
    {
      this.isOk = false;
      this.message.error('Please Enter Ticket Rate', '');
    }


  
    // else if(this.data.DOCUMENT_NAME_SECONDERY==null || this.data.DOCUMENT_NAME_SECONDERY=='')
    // {
    //   this.isOk = false;
    //   this.message.error('Please Enter the Document Name (Marathi)', '');
    // }
    
    // else if(this.data.SEQUENCE_NO==null || this.data.SEQUENCE_NO==0)
    // {
    //   this.isOk = false;
    //   this.message.error('Please Enter the Squence Number', '');
    // }
    if (this.isOk) {
      this.isSpinning = true;
      {
          if (this.data.ID) {
            this.api.updateshowlayoutrates(this.data).subscribe((successCode) => {
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
            this.api.createshowlayoutrates(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(documentMasterPage);
                  this.data = new Showlayoutrates();
                  this.api.getallshowlayoutrates(0, 0, 'SEQUENCE_NO', 'desc', '').subscribe(
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
    this.data = new Showlayoutrates();
    documentMasterPage.form.markAsPristine();
    documentMasterPage.form.markAsUntouched();
  }
  loadseatlayoutgrpname() {
    this.api.getAllSeatlayoutgrpnames(0, 0, '', '', ' ').subscribe(
      (data) => {
        this.seatlayoutgrpname = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
  }
}
