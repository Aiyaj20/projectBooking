import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Showseatbookingdetail } from 'src/app/Models/showseatbookingdetails';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-seatadd',
  templateUrl: './seatadd.component.html',
  styleUrls: ['./seatadd.component.css']
})
export class SeataddComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: Showseatbookingdetail = new Showseatbookingdetail;
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;
  emailpattern=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt=/[a-zA-Z][a-zA-Z ]+/
  mobpattern=/^[6-9]\d{9}$/ 
  



  constructor(private api:ClientmasterService, private message: NzNotificationService) { }

 



//////

  ngOnInit(): void {
  }

  close(): void {
    this.drawerClose();
  }

   //// Only number
   omit(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ////

  resetDrawer(websitebannerPage: NgForm) {
    this.data=new Showseatbookingdetail();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean,websitebannerPage: NgForm): void {
    this.isSpinning=false
    this.isOk = true;
    if(this.data.SHOW_ID <= 0  && this.data.ROW_NAME.trim() == "" && this.data.SEAT_NUMBER <= 0)
    {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    }
    else if(this.data.SHOW_ID==null || this.data.SHOW_ID==0)
    {
      this.isOk = false;
      this.message.error('Please Select Show Name', '');
    }
    else if (this.data.ROW_NAME == null || this.data.ROW_NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Row Name', '');
    }
 
   

    else if (this.data.SEAT_NUMBER == null || this.data.SEAT_NUMBER <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Seat Number', '');
    }
if(this.isOk)
{
  this.isSpinning=false; 
 
  this.isSpinning=true; 
if(this.data.ID)
{
    this.api.updateshowseatbookingdetails(this.data)
    .subscribe(successCode => {
      if(successCode.code=="200")
      {
        this.message.success(' Information Updated Successfully...', '');
        if(!addNew)
          this.drawerClose();
          this.isSpinning = false;
      }   
      else
      {
        this.message.error(' Failed To Update Information...', '');
        this.isSpinning = false;
      }
    });
  }
  else{
  
      this.api.createshowseatbookingdetails(this.data)
      .subscribe(successCode => {
        if(successCode.code=="200")
        {
          this.message.success(' Information Save Successfully...', '');
          if(!addNew)
         this.drawerClose();
            else
            {
              this.data=new Showseatbookingdetail();
              this.resetDrawer(websitebannerPage);
              // this.data.img= '';
              
              this.api.getallshowseatbookingdetails(1,1,'','desc','').subscribe (data =>{
                // if (data['count']==0){
                //   this.data.SEQUENCE_NO=1;
                // }else
                // {
                //   this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                // }
              },err=>{
                console.log(err);
              })
            }
            this.isSpinning = false;
          }
           else
           {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
           }
          });
        }
}


  }
//Open social media link method
  open(link:any){
    if(link!=null || link!=undefined){
    window.open(link);
    }
  }

}
