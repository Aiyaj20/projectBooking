import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-oncoming',
  templateUrl: './oncoming.component.html',
  styleUrls: ['./oncoming.component.css']
})
export class OncomingComponent implements OnInit {

  constructor(
    public api: ClientmasterService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  
  ) {}

  ngOnInit(): void {
  }

  getTimeIn12Hour(time: any) {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }

}
