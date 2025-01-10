import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-generation',
  templateUrl: './ticket-generation.component.html',
  styleUrls: ['./ticket-generation.component.css']
})
export class TicketGenerationComponent implements OnInit {
ngOnInit(): void {
  
}
  ticketData = {
    drama: '',
    name: '',
    noOfTickets: 0,
    showTime: '',
  };

  // Example drama options
  dramas: string[] = ['Comedy', 'Tragedy', 'Drama', 'Musical'];

  // Method to handle ticket booking and direct printing
  bookTicket(ticketForm: any): void {
    if (ticketForm.valid) {
      const ticketContent = `
        <div style="text-align: center; padding: 20px; border: 2px solid #000; width: 300px; margin: 0 auto;">
          <h2 style="color: red;">Ticket</h2>
          <p><strong>Drama: </strong>${this.ticketData.drama}</p>
          <p><strong>Name: </strong>${this.ticketData.name}</p>
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
      alert('Please fill out all fields before booking.');
    }
  }
}
