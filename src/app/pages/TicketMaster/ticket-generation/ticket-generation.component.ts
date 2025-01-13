import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
interface Seat {
  NAME: string;
  IS_BOOKED: boolean;
  IS_SEAT: boolean;
  isSelected?: boolean;  // Add isSelected property as optional
}

interface Row {
  SEATS: Seat[];
}

interface Section {
  SECTION_NAME: string;
  ROWS: Row[];
}
@Component({
  selector: 'app-ticket-generation',
  templateUrl: './ticket-generation.component.html',
  styleUrls: ['./ticket-generation.component.css']
})
export class TicketGenerationComponent implements OnInit {

  ticketData = {
    drama: '',
    name: '',
    noOfTickets: 0,
    showTime: '',
  };
    constructor(
      private message: NzNotificationService,
      private api: ClientmasterService,
      private datePipe: DatePipe
    ) {}
  
sections=
[
  {
    "SECTION_NAME": "Platinum",
    "ROWS": [
      {
        "SEATS": [
          { "NAME": "1-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-2", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-3", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "1-4", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      },
      {
        "SEATS": [
          { "NAME": "2-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-2", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-3", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-4", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "2-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      }
    ]
  },
  {
    "SECTION_NAME": "Gold",
    "ROWS": [
      {
        "SEATS": [
          { "NAME": "1-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-2", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-3", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-4", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "1-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      },
      {
        "SEATS": [
          { "NAME": "2-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-2", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-3", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "2-4", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      }
    ]
  },
  {
    "SECTION_NAME": "Silver",
    "ROWS": [
      {
        "SEATS": [
          { "NAME": "1-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-2", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "1-3", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-4", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "1-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      },
      {
        "SEATS": [
          { "NAME": "2-1", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-2", "IS_BOOKED": true, "IS_SEAT": true },
          { "NAME": "2-3", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-4", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-5", "IS_BOOKED": false, "IS_SEAT": true },
          { "NAME": "2-6", "IS_BOOKED": false, "IS_SEAT": true }
        ]
      }
    ]
  }
]

  // Example drama options
  dramas: any[] = [{id:1,name:'Comedy'}, {id:2,name:'Tragedy'}, {id:3,name:'Drama'}, {id:4,name:'Musical'}];

  // Method to handle ticket booking and direct printing
  bookTicket(ticketForm: any): void {
    console.log("selected Seats",this.selectedSeats);

    if (ticketForm.valid) {
      const ticketContent = `
        <div style="text-align: center; padding: 20px; border: 2px solid #000; width: 300px; margin: 0 auto;">
          <h2 style="color: red;">Ticket</h2>
          <p><strong>Drama: </strong>${this.ticketData.drama}</p>
          <p><strong>Number of Tickets: </strong>${this.ticketData.noOfTickets}</p>
          <p><strong>Show Time: </strong>${this.ticketData.showTime}</p>
        </div>
      `;

      // Open a new window for printing
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>Ticket</title></head><body>');
      printWindow?.document.write(ticketContent);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    } else {
      this.message.warning("Please fill out all fields before booking.", '');
    }
  }

    ngOnInit(): void {
    // Initialize dynamic 'isSelected' property for each seat
    this.sections.forEach(section => {
      section.ROWS.forEach(row => {
        row.SEATS.forEach((seat:Seat) => {
          seat.isSelected = seat.isSelected || false;  // Initialize isSelected to false if not defined
        });
      });
    });
  }

 // Variable to hold the number of seats the user wants to select
//  numberOfSeatsToSelect: number = 0;
 selectedSeatsCount: number = 0;



 // Toggle seat selection and check for max number of seats
 toggleSeatSelection(seat: Seat): void {
   if (!seat.IS_BOOKED && this.selectedSeatsCount < this.ticketData.noOfTickets) {
     seat.isSelected = !seat.isSelected;
     this.updateSelectedSeatsCount();
   } else if (!seat.IS_BOOKED && this.selectedSeatsCount >= this.ticketData.noOfTickets && seat.isSelected) {
     seat.isSelected = false;
     this.updateSelectedSeatsCount();
   }
 }
 selectedSeats: Seat[] = [];

 // Update the number of selected seats
 updateSelectedSeatsCount(): void {
   this.selectedSeatsCount = this.sections
     .flatMap(section => section.ROWS)
     .flatMap(row => row.SEATS)
     .filter((seat:Seat) => seat.isSelected && !seat.IS_BOOKED)
     .length;

      // Update the selectedSeats array with the current selection
    this.selectedSeats = this.sections
    .flatMap(section => section.ROWS)
    .flatMap(row => row.SEATS)
    .filter((seat:Seat) => seat.isSelected && !seat.IS_BOOKED);


 }

 // Get the style for each seat (booked, selected, available, gap)
 getSeatStyle(seat: Seat): string {
   if (seat.IS_BOOKED) {
     return 'booked';
   } else if (seat.isSelected) {
     return 'selected';
   } else if (seat.IS_SEAT) {
     return 'available';
   } else {
     return 'gap';
   }
 }

 // Check if the user can select a seat
 canSelectSeat(seat: Seat): boolean {
   return !seat.IS_BOOKED && this.selectedSeatsCount < this.ticketData.noOfTickets;
 }
}
