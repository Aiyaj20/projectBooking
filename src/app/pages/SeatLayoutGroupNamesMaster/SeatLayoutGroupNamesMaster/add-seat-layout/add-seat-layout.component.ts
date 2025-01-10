import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SeatLayout } from 'src/app/Models/seatmaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-add-seat-layout',
  templateUrl: './add-seat-layout.component.html',
  styleUrls: ['./add-seat-layout.component.css'],
})
export class AddSeatLayoutComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: SeatLayout = new SeatLayout();
  @Input()
  drawerVisible: boolean = false;

  inputValue: any;
  title = '';

  dateFormat = 'yyyy/MM/dd';
  isSpinning = false;
  isOk = true;
  constructor(
    public api: ClientmasterService,
    private message: NzNotificationService
  ) {}
  ngOnInit(): void {}

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

  ///Allow only characters
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

  ///// Allow only number and character
  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }
  resetDrawer(seatform: NgForm) {
    this.data = new SeatLayout();
    seatform.form.markAsPristine();
    seatform.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, seatform: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.NAME.trim() == '' && this.data.SHORT_CODE == undefined) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.NAME.trim() == '' ||
      this.data.NAME == null || this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Seat Layout Group Name ', '');
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
      this.message.error(' Please Enter Sequence Number ', '');
    } else if (
      this.data.SEQUENCE_NUMBER == undefined ||
      this.data.SEQUENCE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }
    // create update

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updateSeatLayoutMaster(this.data)
            .subscribe((successCode) => {
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
          this.api
            .createSeatLayoutMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Entered Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new SeatLayout();
                  this.resetDrawer(seatform);
                  // this.data.IMG_URL= '';

                  this.api
                    .getSeatLayoutMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
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
