import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Theatrelayoutmapping2 } from 'src/app/Models/Theatrelayoutmapping2';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-datadisplay',
  templateUrl: './datadisplay.component.html',
  styleUrls: ['./datadisplay.component.css'],
})
export class DatadisplayComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  drawerVisible: boolean = false;
  @Input() endseatnumbar: any = [];
  @Input() datataa1: any = [];
  @Input() layoutbutton: any;
  @Input() rowname: any;
  screenwidth = window.innerWidth;
  loadingRecords: boolean = false;
  data: Theatrelayoutmapping2 = new Theatrelayoutmapping2();
  constructor(
    private message: NzNotificationService,
    private api: ClientmasterService
  ) {}

  newarray = [];

  ngOnInit(): void {}
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  close() {
    this.drawerClose();
  }

  onchange(event: any) {
    if (event.IS_AVAILABLE_FOR_BOOKING == false) {
    }
  }
  data2: any = [];
  addbulk() {
    for (var i = 1; i < this.datataa1.length; i++) {
      if (this.datataa1[i].SEAT_STATUS == 'A') {
        this.datataa1[i].SEAT_STATUS = 'R';
      } else {
        this.datataa1[i].SEAT_STATUS = 'A';
      }
    }

    this.api
      .updateaddbulkcall(this.layoutbutton, this.rowname, this.datataa1)
      .subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Changed Successfully...', '');

          this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Changed...', '');
          this.isSpinning = false;
        }
      });
  }

  isSpinning = false;
  isOk = true;

  onAllChecked(value: boolean): void {
    this.datataa1.forEach((item: any) => {
      if (value) {
        item.IS_ACTIVE = true;
      } else {
        item.IS_ACTIVE = false;
      }
      this.updateCheckedSet(item.THEATRE_LAYOUT_MAPPING_ID, value);
    });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean, ind: any): void {
    if (checked) {
      this.datataa1[ind].SEAT_STATUS = true;
    } else {
      // this.dataList[ind].IS_ACTIVE = false
      this.datataa1[ind].SEAT_STATUS = false;

      this.datataa1[ind].SEAT_NUMBER = 0;
    }
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId: any;
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.datataa1.every((item: any) => {
      this.setOfCheckedId.has(item.THEATRE_LAYOUT_MAPPING_ID);
    });
    this.indeterminate =
      this.datataa1.some((item: any) =>
        this.setOfCheckedId.has(item.THEATRE_LAYOUT_MAPPING_ID)
      ) && !this.checked;
  }

  save() {}
}
