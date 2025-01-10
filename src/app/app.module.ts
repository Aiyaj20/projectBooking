import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
// import { initializeApp } from "firebase/app";
// initializeApp(environment.firebase);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DatePipe } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
// import { NzButtonModule} from 'ng-zorro-antd/'
import { ExportDirective } from './directives/export.directive';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { LoginComponent } from './Login/login/login.component';
import { FormComponent } from './pages/Common/Forms/form/form.component';
import { FormsComponent } from './pages/Common/Forms/forms/forms.component';
import { RoleComponent } from './pages/Common/Roles/role/role.component';
import { RoledetailsComponent } from './pages/Common/Roles/roledetails/roledetails.component';
import { RolesComponent } from './pages/Common/Roles/roles/roles.component';
import { UserComponent } from './pages/Common/Users/user/user.component';
import { UsersComponent } from './pages/Common/Users/users/users.component';
import { DashboardComponent } from './Common/dashboard/dashboard.component';
// import { UsercontactComponent } from './Reports/usercontact/usercontact.component';
// import { NewsubscribersComponent } from './Reports/newsubscribers/newsubscribers.component';
import { LayoutaddComponent } from './pages/theatrelayoutmapping/layoutadd/layoutadd.component';
import { LayoutlistComponent } from './pages/theatrelayoutmapping/layoutlist/layoutlist.component';
import { ShowlistComponent } from './pages/Showlayoutrates/showlist/showlist.component';
import { ShowaddComponent } from './pages/Showlayoutrates/showadd/showadd.component';

import { CardlistComponent } from './pages/CardSeatDetails/cardlist/cardlist.component';
import { CardaddComponent } from './pages/CardSeatDetails/cardadd/cardadd.component';
import { SeataddComponent } from './pages/Showseatbookingdetails/seatadd/seatadd.component';
import { SeatlistComponent } from './pages/Showseatbookingdetails/seatlist/seatlist.component';
import { LayoutbuttonComponent } from './pages/theatrelayoutmapping/layoutbutton/layoutbutton.component';
import { LayoutbuttondetailsComponent } from './pages/theatrelayoutmapping/layoutbuttondetails/layoutbuttondetails.component';
import { CityMaster } from './Models/citymaster';
import { CityyyComponent } from './pages/CityMaster/CityMaster/cityyy/cityyy.component';
import { DramaComponent } from './pages/DramaMaster/DramaMaster/drama/drama.component';
import { AddDramaComponent } from './pages/DramaMaster/DramaMaster/add-drama/add-drama.component';
import { AddCityComponent } from './pages/CityMaster/CityMaster/add-city/add-city.component';
import { TheaterComponent } from './pages/TheaterMaster/TheaterMaster/theater/theater.component';
import { AddTheaterMasterComponent } from './pages/TheaterMaster/TheaterMaster/add-theater-master/add-theater-master.component';
import { AddSeatLayoutComponent } from './pages/SeatLayoutGroupNamesMaster/SeatLayoutGroupNamesMaster/add-seat-layout/add-seat-layout.component';
import { SeatLayoutComponent } from './pages/SeatLayoutGroupNamesMaster/SeatLayoutGroupNamesMaster/seat-layout/seat-layout.component';
import { AdddataComponent } from './pages/showmaster/adddata/adddata.component';
import { DatalistComponent } from './pages/showmaster/datalist/datalist.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { CartReportsComponent } from './pages/Reports/cart-reports/cart-reports.component';
// import { BookingsReportsComponent } from './pages/Reports/bookings-reports/bookings-reports.component';
// import { ShowReportsComponent } from './pages/Reports/show-reports/show-reports.component';
import { ShowlayoutComponent } from './pages/showmaster/showlayout/showlayout.component';
// import { CartComponent } from './Reports/CartMaster/cart/cart.component';
// import { AddCartComponent } from './Reports/CartMaster/add-cart/add-cart.component';
// import { CartComponent } from './pages/CartMaster/cart/cart.component';
// import { AddCartComponent } from './pages/CartMaster/add-cart/add-cart.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BookingsReportsComponent } from './Reports/bookings-reports/bookings-reports.component';
import { UpcomingComponent } from './pages/showmaster/upcoming/upcoming.component';
import { OncomingComponent } from './pages/showmaster/oncoming/oncoming.component';
import { CancelComponent } from './pages/showmaster/cancel/cancel.component';
import { CartReportsComponent } from './Reports/cart-reports/cart-reports.component';
import { ShowReportsComponent } from './Reports/show-reports/show-reports.component';
import { CitywisetheaterreportsComponent } from './Reports/citywisetheaterreports/citywisetheaterreports.component';
import { CitywiseshowrreportsComponent } from './Reports/citywiseshowrreports/citywiseshowrreports.component';
import { TheaterwiseshowreportsComponent } from './Reports/theaterwiseshowreports/theaterwiseshowreports.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { DatadisplayComponent } from './pages/theatrelayoutmapping/datadisplay/datadisplay.component';
import { ShowWiseBookingReportComponent } from './Reports/show-wise-booking-report/show-wise-booking-report.component';
import { TransactionReportComponent } from './Reports/transaction-report/transaction-report.component';
import { ShowSummaryReportComponent } from './Reports/show-summary-report/show-summary-report.component';
import { CategogyWiseReportComponent } from './Reports/categogy-wise-report/categogy-wise-report.component';
import { DistributeMasterComponent } from './pages/DistributeMaster/distribute-master/distribute-master.component';
import { AddDistributeMasterComponent } from './pages/DistributeMaster/add-distribute-master/add-distribute-master.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { OfflinePaymentProcessComponent } from './pages/offline-payment-process/offline-payment-process.component';
import { BookingConfirmReportComponent } from './Reports/booking-confirm-report/booking-confirm-report.component';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    RolesComponent,
    RoleComponent,
    FormComponent,
    FormsComponent,
    RoledetailsComponent,
    DashboardComponent,
    ExportDirective,
    DatadisplayComponent,
    LoginComponent,

    LayoutaddComponent,
    LayoutlistComponent,
    ShowlistComponent,
    ShowaddComponent,

    CardlistComponent,
    CardaddComponent,
    SeataddComponent,
    SeatlistComponent,
    LayoutbuttonComponent,
    LayoutbuttondetailsComponent,
    AddCityComponent,
    CityyyComponent,
    DramaComponent,
    AddDramaComponent,
    TheaterComponent,
    AddTheaterMasterComponent,
    AddSeatLayoutComponent,
    SeatLayoutComponent,
    AdddataComponent,
    DatalistComponent,
    // CartReportsComponent,
    // BookingsReportsComponent,
    ShowReportsComponent,
    ShowlayoutComponent,
    // CartComponent,

    // CartComponent,
    // AddCartComponent,
    BookingsReportsComponent,
    UpcomingComponent,
    OncomingComponent,
    CancelComponent,
    CartReportsComponent,
    CitywisetheaterreportsComponent,
    CitywiseshowrreportsComponent,
    TheaterwiseshowreportsComponent,
    DatadisplayComponent,
    ShowWiseBookingReportComponent,
    TransactionReportComponent,
    ShowSummaryReportComponent,
    CategogyWiseReportComponent,
    DistributeMasterComponent,
    AddDistributeMasterComponent,
    OfflinePaymentProcessComponent,
    BookingConfirmReportComponent
  ],

  imports: [
    NzTabsModule,
    NzTagModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzDrawerModule,
    NzNotificationModule,
    NzSpinModule,
    NzTableModule,
    NzInputModule,
    NzSwitchModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzToolTipModule,
    NzCardModule,
    NzSpaceModule,
    NzModalModule,
    NzTimelineModule,
    NzEmptyModule,
    NzCheckboxModule,
    NzBadgeModule,
    NzCommentModule,
    // ChartsModule
    // NgChartsModule
    NzProgressModule,
    Ng2GoogleChartsModule,
    NzBreadCrumbModule,
    NzStepsModule,
    NzInputNumberModule,
    NzTimePickerModule,

    NzCascaderModule,
    NzSelectModule,
    NzRadioModule,
    NzPopconfirmModule,
    ColorPickerModule,
    NzImageModule ,
    PdfViewerModule
    // NgxPrintModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
