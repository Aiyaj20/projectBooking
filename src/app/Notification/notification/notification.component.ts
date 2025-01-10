import { Component, OnInit } from '@angular/core';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  isSpinning = false;
  // time = formatDistance(new Date(), new Date());
  today: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }
  
}
