import { Directive, HostListener, Input } from '@angular/core';
// import { ExportService } from '../Services/export.service';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Directive({
  selector: '[appExport]',
})
export class ExportDirective {
  constructor(private exportService: ClientmasterService) {}

  @Input('appExport') dataList: any[] = [];
  @Input() fileName: string = '';
  converted: any;
  @HostListener('click', ['$event']) onClick($event: any) {
    // if (this.fileName == "Inward Data") {
    //   this.dataList = this.dataList.map(({
    //     INWARD_DATE: Inward_Date, VEHICLE_NO: Vehicle_Number, AGENT_NAME: Agent_Name,
    //      TOTAL_QTY: Total_Quantity(MT), REGION: Region
    //   }) =>
    //     { Inward_Date, Vehicle_Number, Agent_Name, Total_Quantity(MT), Region });
    // }
    // this.exportService.exportExcel(this.dataList, this.fileName);
    if (this.fileName == 'Showmaster') {
      this.dataList = this.dataList.map(
        ({
          THEATRE_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
          TOTAL_SEATS,
          AVAILABLE_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        }) => ({
          THEATRE_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
          TOTAL_SEATS,
          AVAILABLE_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        })
      );
      this.converted = this.rekey(this.dataList, {
        THEATRE_NAME: 'Theater Name',
        DRAMA_NAME: 'Drama Name ',
        DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        BOOKING_STATUS: 'Booking Status',
        TOTAL_SEATS: 'Total Seats',
        AVAILABLE_SEATS: 'Available seats',
        BOOKED_SEATS: 'Booked Seats',
        TOTAL_REVENUE: 'Total Revenue (₹)',
      });
    } else if (this.fileName == 'Dramamaster') {
      this.dataList = this.dataList.map(
        ({ NAME, CAST_NAMES, FROM_DATE, TO_DATE }) => ({
          NAME,
          CAST_NAMES,
          FROM_DATE,
          TO_DATE,
        })
      );
      this.converted = this.rekey(this.dataList, {
        NAME: 'Drama Name',
        CAST_NAMES: 'Cast Name',
        FROM_DATE: 'From Date',
        TO_DATE: 'To Date',
      });
    } else if (this.fileName == 'Ritual Item Transaction Master') {
      this.dataList = this.dataList.map(
        ({
          PRIEST_NAME,
          PART_NAME,
          TENUARE_YEAR,
          TENUARE_MONTH,
          TENUARE_DAYS,
          CHAVAR_NAME,
          TAKER_NAME,
          GIVER_NAME,
          GIVEN_DATE,
          REFUNDED_DATE,
          IS_SHORTAGE,
          ADDITIONAL_REMARKES,
          TOTAL_ITEMS,
          TOTAL_RETURNED_ITEMS,
        }) => ({
          PRIEST_NAME,
          PART_NAME,
          TENUARE_YEAR,
          TENUARE_MONTH,
          TENUARE_DAYS,
          CHAVAR_NAME,
          TAKER_NAME,
          GIVER_NAME,
          GIVEN_DATE,
          REFUNDED_DATE,
          IS_SHORTAGE,
          ADDITIONAL_REMARKES,
          TOTAL_ITEMS,
          TOTAL_RETURNED_ITEMS,
        })
      );
      this.converted = this.rekey(this.dataList, {
        PRIEST_NAME: ' पुजारी नाव',
        PART_NAME: ' भागाचे नाव',
        TENUARE_YEAR: ' कार्यकाळ वर्ष',
        TENUARE_MONTH: 'कार्यकाळ महिने',
        TENUARE_DAYS: 'कार्यकाळ दिवस',
        CHAVAR_NAME: 'चावर नाव',
        TAKER_NAME: 'घेणाऱ्याचे नाव',
        GIVER_NAME: 'दाताचे नाव',
        GIVEN_DATE: 'दिलेली तारीख',
        REFUNDED_DATE: 'परताव्याची तारीख',
        IS_SHORTAGE: 'कमी आहे',
        ADDITIONAL_REMARKES: 'अतिरिक्त टिप्पणी',
        TOTAL_ITEMS: 'एकूण आयटम',
        TOTAL_RETURNED_ITEMS: 'एकूण परत केलेल्या वस्तू',
      });
    } else if (this.fileName == 'देणगी यादी') {
      this.dataList = this.dataList.map(
        ({
          DATE,
          AGENT_NAME,
          AGENT_NAME_MR,
          DEVOTEE_NAME,
          TYPE_NAME,
          RECEIPT_NO,
          AMOUNT,
          PLATFORM_NAME,
          MODE_NAME,
          BANK,
          REFERANCE_NO,
          PAYMENT_GATEWAY_ID,
        }) => ({
          DATE,
          AGENT_NAME,
          AGENT_NAME_MR,
          DEVOTEE_NAME,
          TYPE_NAME,
          RECEIPT_NO,
          AMOUNT,
          PLATFORM_NAME,
          MODE_NAME,
          BANK,
          REFERANCE_NO,
          PAYMENT_GATEWAY_ID,
        })
      );
      this.converted = this.rekey(this.dataList, {
        DATE: ' तारीख',
        AGENT_NAME: ' एजंटचे नाव (इंग्रजी)',
        AGENT_NAME_MR: 'एजंटचे नाव (मराठी)',
        DEVOTEE_NAME: 'समर्पित',
        TYPE_NAME: 'प्रकार',
        RECEIPT_NO: 'पावती नंबर',
        AMOUNT: 'रक्कम',
        PLATFORM_NAME: 'प्लॅटफॉर्म',
        MODE_NAME: 'मोड',
        BANK: 'बँक',
        REFERANCE_NO: 'संदर्भ',
        PAYMENT_GATEWAY_ID: 'पेमेंट गेटवे आयडी',
      });
    } else if (this.fileName == 'Bookingsdetails') {
      this.dataList = this.dataList.map(
        ({
          THEATRE_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          TOTAL_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        }) => ({
          THEATRE_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          TOTAL_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        })
      );
      this.converted = this.rekey(this.dataList, {
        THEATRE_NAME: ' Theater Name',
        DRAMA_NAME: 'Show Name',
        DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        TOTAL_SEATS: 'Totals Seats',
        BOOKED_SEATS: 'Booked Seats',
        TOTAL_REVENUE: 'Amount',
      });
    } else if (this.fileName == 'cartdetails') {
      this.dataList = this.dataList.map(
        ({
          THEATRE_NAME,
          SHOW_NAME,
          SHOW_DATE,
          START_TIME,
          END_TIME,
          MOBILE_NO,
          SEAT_NUMBERS,
          TOTAL_AMOUNT,
        }) => ({
          THEATRE_NAME,
          SHOW_NAME,
          SHOW_DATE,
          START_TIME,
          END_TIME,
          MOBILE_NO,
          SEAT_NUMBERS,
          TOTAL_AMOUNT,
        })
      );
      this.converted = this.rekey(this.dataList, {
        THEATRE_NAME: 'Theater Name',
        SHOW_NAME: ' Show Name',
        SHOW_DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        MOBILE_NO: 'Mobile Number',
        SEAT_NUMBERS: 'Seat Numbers',
        TOTAL_AMOUNT: 'Total Amount',
      });
    } else if (this.fileName == 'showdetails') {
      this.dataList = this.dataList.map(
        ({
          THEATRE_NAME,
          DRAMA_NAME,
          CAST_NAMES,
          CITY_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
          TOTAL_SEATS,
          AVAILABLE_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        }) => ({
          THEATRE_NAME,
          DRAMA_NAME,
          CAST_NAMES,
          CITY_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
          TOTAL_SEATS,
          AVAILABLE_SEATS,
          BOOKED_SEATS,
          TOTAL_REVENUE,
        })
      );
      this.converted = this.rekey(this.dataList, {
        THEATRE_NAME: ' Theater Name',
        DRAMA_NAME: 'Drama Name',
        CAST_NAMES: 'Cast Name',
        CITY_NAME: 'City Name',
        DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        BOOKING_STATUS: 'Booking Status',
        TOTAL_SEATS: 'Total Seats',
        AVAILABLE_SEATS: 'Available Seats',
        BOOKED_SEATS: 'Booked Seats',
        TOTAL_REVENUE: 'Amount',
      });
    } else if (this.fileName == 'theaterwiseshowreports') {
      this.dataList = this.dataList.map(
        ({
          THEATRE_NAME,
          DRAMA_NAME,
          CITY_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
        }) => ({
          THEATRE_NAME,
          DRAMA_NAME,
          CITY_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
        })
      );
      this.converted = this.rekey(this.dataList, {
        THEATRE_NAME: 'Theater Name',
        DRAMA_NAME: 'Drama Name',
        CITY_NAME: 'City Name',
        DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        BOOKING_STATUS: 'Booking Status',
      });
    } else if (this.fileName == 'citywiseshowreports') {
      this.dataList = this.dataList.map(
        ({
          CITY_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
        }) => ({
          CITY_NAME,
          DRAMA_NAME,
          DATE,
          START_TIME,
          END_TIME,
          BOOKING_STATUS,
        })
      );
      this.converted = this.rekey(this.dataList, {
        CITY_NAME: ' City Name',
        DRAMA_NAME: 'Show Name',
        DATE: 'Date',
        START_TIME: 'Start Time',
        END_TIME: 'End Time',
        BOOKING_STATUS: 'Booking Status',
      });
    } else if (this.fileName == 'citywisetheaterreports') {
      this.dataList = this.dataList.map(
        ({ CITY_NAME, ADDRESS, LATITUDE, LONGITUDE }) => ({
          CITY_NAME,
          ADDRESS,
          LATITUDE,
          LONGITUDE,
        })
      );
      this.converted = this.rekey(this.dataList, {
        CITY_NAME: ' City Name',
        ADDRESS: 'Address',
        LATITUDE: 'Latitude',
        LONGITUDE: 'Longitude',
      });
    } else if (this.fileName == 'Group_Membership_Monthwise_Report') {
      this.dataList = this.dataList.map(
        ({
          UNIT_NAME,
          GROUP_NAME,
          _20_21_MEMBER_COUNT,
          _21_22_MEMBER_COUNT,
          APRIL,
          MAY,
          JUNE,
          JULY,
          SEPTEMBER,
          OCTOMBER,
          NOVEMBER,
          DECEMBER,
          JANUARY,
          FEBRUARY,
          MARCH,
        }) => ({
          UNIT_NAME,
          GROUP_NAME,
          _20_21_MEMBER_COUNT,
          _21_22_MEMBER_COUNT,
          APRIL,
          MAY,
          JUNE,
          JULY,
          SEPTEMBER,
          OCTOMBER,
          NOVEMBER,
          DECEMBER,
          JANUARY,
          FEBRUARY,
          MARCH,
        })
      );
      this.converted = this.rekey(this.dataList, {
        UNIT_NAME: ' Unit Name',
        GROUP_NAME: 'Group Name',
        _20_21_MEMBER_COUNT: '20-21',
        _21_22_MEMBER_COUNT: '21-22',
        APRIL: 'Apr 22',
        MAY: 'May 22',
        JUNE: 'Jun 22',
        JULY: 'July 22',
        AUGUST: 'Aug 22',
        SEPTEMBER: 'Sept 22',
        OCTOMBER: 'Oct 22',
        NOVEMBER: 'Nov 22',
        DECEMBER: 'Dec 22 ',
        JANUARY: 'Jan 23',
        FEBRUARY: 'Feb 23',
        MARCH: 'Mar 23',
      });
    } else if (this.fileName == 'Unit_Board_Of_Director_Report') {
      this.dataList = this.dataList.map(
        ({ UNIT_NAME, DIRECTOR, OFFICER1 }) => ({
          UNIT_NAME,
          DIRECTOR,
          OFFICER1,
        })
      );
      this.converted = this.rekey(this.dataList, {
        UNIT_NAME: ' Unit Name',
        DIRECTOR: 'Director',
        OFFICER1: 'Officer 1',
      });
    } else if (this.fileName == 'Unit_Membership_Summary_Report') {
      this.dataList = this.dataList.map(
        ({
          UNIT_NAME,
          GROUP_COUNT,
          _20_21_MEMBER_COUNT,
          _21_22_MEMBER_COUNT,
          CURRENT_TOTAL,
        }) => ({
          UNIT_NAME,
          GROUP_COUNT,
          _20_21_MEMBER_COUNT,
          _21_22_MEMBER_COUNT,
          CURRENT_TOTAL,
        })
      );
      this.converted = this.rekey(this.dataList, {
        UNIT_NAME: ' Unit Name',
        GROUP_COUNT: 'Group Count',
        _20_21_MEMBER_COUNT: '20-21 Member Count',
        _21_22_MEMBER_COUNT: '21-22 Member Count',
        CURRENT_TOTAL: 'Current Total',
      });
    } else if (this.fileName == 'Group_Board_Of_Director_Report') {
      this.dataList = this.dataList.map(
        ({
          UNIT_NAME,
          GROUP_COUNT,
          PRESIDENT,
          VPI,
          VPE,
          TYPE,
          SECRETORY,
          TREASURER,
          DIRECTOR1,
          DIRECTOR2,
          DIRECTOR3,
          DIRECTOR4,
          DIRECTOR5,
        }) => ({
          UNIT_NAME,
          GROUP_COUNT,
          PRESIDENT,
          VPI,
          VPE,
          TYPE,
          SECRETORY,
          TREASURER,
          DIRECTOR1,
          DIRECTOR2,
          DIRECTOR3,
          DIRECTOR4,
          DIRECTOR5,
        })
      );
      this.converted = this.rekey(this.dataList, {
        UNIT_NAME: ' Unit Name',
        GROUP_COUNT: 'Group Count',
        PRESIDENT: 'Presedent',
        VPI: ' Vice President Internal',
        VPE: 'Vice President External',
        TYPE: ' Type',
        SECRETORY: 'Secretory',
        TREASURER: 'Treasurer',
        DIRECTOR1: 'Director 1',
        DIRECTOR2: 'Director 2 ',
        DIRECTOR3: 'Director 3',
        DIRECTOR4: 'Director 4',
        DIRECTOR5: 'Director 5',
      });
    }
    else if (this.fileName == 'Theater') {
      
      this.dataList = this.dataList.map(
        ({
          SEQUENCE_NUMBER,
          CITY_NAME,
          NAME,
          ADDRESS,
          LATITUDE,
          LONGITUDE,
          STATUS,
        }) => ({
          SEQUENCE_NUMBER,
          CITY_NAME,
          NAME,
          ADDRESS,
          LATITUDE,
          LONGITUDE,
          STATUS: STATUS == 1 ? 'Active' : 'Inactive',
        })
      );
      this.converted = this.rekey(this.dataList, {
        SEQUENCE_NUMBER: 'Sequence No',
        CITY_NAME: 'City Name',
        NAME:'Theater Name',
        ADDRESS:'Theater Address',
        LATITUDE:'Latitude',
        LONGITUDE:'Longitude',
        STATUS:'Status'
      });
    }
    this.exportService.exportExcel(this.converted, this.fileName);
  }
  rekey(arr: any, lookup: any) {
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      for (var fromKey in lookup) {
        var toKey = lookup[fromKey];
        var value = obj[fromKey];
        // if (value) {
        obj[toKey] = value;
        delete obj[fromKey];
        // }
      }
    }
    return arr;
  }
}
