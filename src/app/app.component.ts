import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { UserMaster } from './Models/usermaster';
import { environment } from '../environments/environment';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ClientmasterService } from './Services/clientmaster.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isVisible = false;
  isCollapsed = false;
  isSpinning = false;
  isLogedIn = false;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  screenwidth = 0;
  // isPassword = false;
  roleId = Number(sessionStorage.getItem('roleId'));
  menus = [];
  USERNAME = sessionStorage.getItem('userName');
  userId = sessionStorage.getItem('userId');
  user = new UserMaster();
  showconfirm = false;
  currentroute = '';

  //Notification variables
  title = 'af-notification';
  messages: any = null;
  drawerVisible!: boolean;
  drawerTitle!: string;
  // drawerData: Notification = new Notification();

  constructor(
    private router: Router,
    private api: ClientmasterService,
    private cookie: CookieService,
    private message: NzNotificationService
  ) {
    this.loggerInit();
    this.screenwidth = window.innerWidth;
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }

  checkpass() {
    this.api
      .getAllUsers(0, 0, 'ID', 'desc', ' AND ID=' + this.userId)
      .subscribe(
        (data) => {
          this.user = data['data'][0];
          if (this.PASSWORD == this.user.PASSWORD) {
            this.showconfirm = true;
          } else {
            this.showconfirm = false;
            this.message.error('Please enter correct password', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  confpass() {
    this.isSpinning = false;
    this.showconfirm = true;

    if (this.NEWPASSWORD.trim() == '' && this.CONFPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter All Fields', '');
    } else if (this.NEWPASSWORD == null || this.NEWPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter New Password', '');
    } else if (this.CONFPASSWORD == null || this.CONFPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter Correct Confirm Password', '');
    } else if (this.NEWPASSWORD == this.CONFPASSWORD) {
      this.user.PASSWORD = this.NEWPASSWORD;
      this.api.updateUser(this.user).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('User Updated Successfully...', '');
          //if(!addNew)
          // this.drawerClose();
          this.isVisible = false;
          this.NEWPASSWORD = '';
          this.CONFPASSWORD = '';
          this.PASSWORD = '';
          this.isSpinning = false;
        } else {
          this.message.error('User Updation Failed...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.message.error(
        'Please enter new password & confirm password same',
        ''
      );
    }
  }

  loggerInit() {
    if (
      this.cookie.get('supportKey') === '' ||
      this.cookie.get('supportKey') === null
    ) {
      this.api.loggerInit().subscribe(
        (data) => {
          if (data.code == '200') {
            this.cookie.set(
              'supportKey',
              data['data'][0]['supportkey'],
              365,
              '',
              '',
              false,
              'Strict'
            );
          }
        },
        (err) => {}
      );
    } else {
    }
  }

  ngOnInit() {
    //Notification
    // this.requestPermission();
    // this.listen();
    //
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null)
      this.isLogedIn = false;
    else {
      if (this.userId || this.roleId != 0) {
        this.isLogedIn = true;

        this.loadForms();
      } else {
        this.api.logoutForSessionValues();
      }
    }
  }

  loadForms() {
    this.api.getForms(this.roleId).subscribe((data) => {
      if (data['code'] == 200 && data['data'] != null) {
        data['data'].forEach((element: any) => {
          element['children'].sort(this.sortFunction);

          if (element['children'].length == 0) delete element['children'];
        });
        this.menus = data['data'].sort(this.sortFunction);
      }
    });
  }

  sortFunction(a: any, b: any) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }

  // logout() {
  //   this.cookie.delete("supportKey")
  //   this.cookie.delete("token")
  //   sessionStorage.clear();
  //   window.location.reload();
  // }
  logout() {
    this.cookie.delete('supportKey');
    this.cookie.delete('visitorId');
    this.cookie.delete('token');
    this.cookie.delete('userId');
    this.cookie.delete('ORGANIZATION_ID');
    this.cookie.delete('ROLE_ID');

    window.location.reload();
    // this.router.navigateByUrl('/login')
  }

  changepass(): void {
    this.isVisible = true;
  }
  // showModal(): void {
  //   this.isVisible = true;
  // }

  // handleOk(): void {
  //  // this.isPassword=true;

  //   this.isVisible = false;
  // }

  // handleCancel(): void {

  //   this.isVisible = false;
  // }

  //Notification
  // this.requestPermission();
  //   this.listen();

  // requestPermission() {
  //   const messaging = getMessaging();
  //   getToken(messaging,
  //    { vapidKey: environment.firebase.apiKey}).then(
  //      (currentToken) => {
  //        if (currentToken) {

  //        } else {

  //        }
  //    }).catch((err) => {

  //   });
  // }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.messages = payload;
    });
  }

  //Notification drawer

  add(): void {
    this.drawerTitle = 'Notification';
    // this.drawerData = new TrainerMaster();
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  drawerClose(): void {
    // this.search();
    this.drawerVisible = false;
  }
}
