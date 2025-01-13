import { Component, NgModule } from '@angular/core';
import { LoginComponent } from './Login/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './Common/dashboard/dashboard.component';
import { FormsComponent } from './pages/Common/Forms/forms/forms.component';
import { RolesComponent } from './pages/Common/Roles/roles/roles.component';
import { UsersComponent } from './pages/Common/Users/users/users.component';
// import { NewsubscribersComponent } from './Reports/newsubscribers/newsubscribers.component';
// import { UsercontactComponent } from './Reports/usercontact/usercontact.component';
import { LayoutlistComponent } from './pages/theatrelayoutmapping/layoutlist/layoutlist.component';
import { ShowlistComponent } from './pages/Showlayoutrates/showlist/showlist.component';

import { SeatlistComponent } from './pages/Showseatbookingdetails/seatlist/seatlist.component';
import { CardlistComponent } from './pages/CardSeatDetails/cardlist/cardlist.component';
import { CityyyComponent } from './pages/CityMaster/CityMaster/cityyy/cityyy.component';
import { DramaComponent } from './pages/DramaMaster/DramaMaster/drama/drama.component';
import { SeatLayout } from './Models/seatmaster';
import { TheaterMasterr } from './Models/theatermaster';
import { SeatLayoutComponent } from './pages/SeatLayoutGroupNamesMaster/SeatLayoutGroupNamesMaster/seat-layout/seat-layout.component';
import { TheaterComponent } from './pages/TheaterMaster/TheaterMaster/theater/theater.component';
import { DatalistComponent } from './pages/showmaster/datalist/datalist.component';
// import { CartComponent } from './Reports/CartMaster/cart/cart.component';
import { BookingsReportsComponent } from './Reports/bookings-reports/bookings-reports.component';
import { CartReportsComponent } from './Reports/cart-reports/cart-reports.component';
import { ShowReportsComponent } from './Reports/show-reports/show-reports.component';
import { CitywisetheaterreportsComponent } from './Reports/citywisetheaterreports/citywisetheaterreports.component';
import { CitywiseshowrreportsComponent } from './Reports/citywiseshowrreports/citywiseshowrreports.component';
import { TheaterwiseshowreportsComponent } from './Reports/theaterwiseshowreports/theaterwiseshowreports.component';
import { CategogyWiseReportComponent } from './Reports/categogy-wise-report/categogy-wise-report.component';
import { ShowWiseBookingReportComponent } from './Reports/show-wise-booking-report/show-wise-booking-report.component';
import { TransactionReportComponent } from './Reports/transaction-report/transaction-report.component';
import { ShowSummaryReportComponent } from './Reports/show-summary-report/show-summary-report.component';
import { DistributeMasterComponent } from './pages/DistributeMaster/distribute-master/distribute-master.component';
import { OfflinePaymentProcessComponent } from './pages/offline-payment-process/offline-payment-process.component';
import { BookingConfirmReportComponent } from './Reports/booking-confirm-report/booking-confirm-report.component';
import { CasteMasterListComponent } from './pages/CasteMaster/caste-master-list/caste-master-list.component';
import { BannerMasterListComponent } from './pages/BannerMaster/banner-master-list/banner-master-list.component';
import { TicketGenerationComponent } from './pages/TicketMaster/ticket-generation/ticket-generation.component';

// import { CartComponent } from './pages/CartMaster/cart/cart.component';

const routes: Routes = [
  { path: 'login', redirectTo: 'login' },

  { path: 'users', component: UsersComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'layoutmapp', component: LayoutlistComponent },
  { path: 'showlayoutrates', component: ShowlistComponent },

  { path: 'Seatlist', component: SeatlistComponent },
  { path: 'cardlist', component: CardlistComponent },
  { path: 'citymaster', component: CityyyComponent },
  { path: 'dramamaster', component: DramaComponent },

  { path: 'seatlayout', component: SeatLayoutComponent },
  { path: 'theatermaster', component: TheaterComponent },
  { path: 'showmaster', component: DatalistComponent },
  // { path: 'cart', component:CartComponent},
  { path: 'bookingreport', component: BookingsReportsComponent },
  { path: 'cartdetails', component: CartReportsComponent },

  { path: 'showreports', component: ShowReportsComponent },
  {
    path: 'citywisetheaterreports',
    component: CitywisetheaterreportsComponent,
  },
  { path: 'citywiseshowreports', component: CitywiseshowrreportsComponent },
  {
    path: 'theaterwiseshowreports',
    component: TheaterwiseshowreportsComponent,
  },
  {
    path: 'categorywisereports',
    component: CategogyWiseReportComponent,
  },
  {
    path: 'showwisebookingreports',
    component: ShowWiseBookingReportComponent,
  },
  {
    path: 'transactionreports',
    component: TransactionReportComponent,
  },

  {
    path: 'distributermaster',
    component: DistributeMasterComponent,
  },
  {
    path: 'showsummaryreports',
    component: ShowSummaryReportComponent,
  },
  {
    path: 'offlinepayment',
    component: OfflinePaymentProcessComponent,
  },
  { path: 'bookingconfirmreport', component: BookingConfirmReportComponent },
  {path:'cast-master',component:CasteMasterListComponent},
  {path:'banner-master',component:BannerMasterListComponent},
  {path:'ticket-generation',component:TicketGenerationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
