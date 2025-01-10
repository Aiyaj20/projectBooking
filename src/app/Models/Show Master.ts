export class Master {
  ID: any;

  THEATRE_ID: number = 0;

  DRAMA_ID: any = 0;
  DISTIBUTOR_ID!:any
  THEATRE_NAME: string = ''
  DRAMA_NAME: string = ''
  DATE: any;
  START_TIME: any;
  END_TIME: any;
  BOOKING_STATUS: string = 'NSY';

  TOTAL_SEATS: number = 0;

  AVAILABLE_SEATS: number = 0;

  BOOKED_SEATS: number = 0;
  TOTAL_REVENUE: number = 0;

  TICKET_RATE: any[] = []
  RATE_ARRAY: any = []
  SHOW_STATUS:any
  IS_ACTIVE:boolean=true
} 
