import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { UserMaster } from 'src/app/Models/usermaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
// import { ClientmasterService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserMaster = new UserMaster;
  EMAIL_ID = "";
  PASSWORD = "";
  supportKey = "";
  ORGANIZATION_ID: number | undefined;
  passwordVisible = false;
  isloginSpinning = false;
  isLogedIn = false;


  constructor(private cookie: CookieService, private router: Router, private api: ClientmasterService, private message: NzNotificationService) { }

  ngOnInit(): void {

    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      this.router.navigate(['/login'])
    }
    else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard'])
    }
    const userId = '1';
    this.api.requestPermission(userId)
  }

  login(): void {
    if (this.EMAIL_ID == "" && this.PASSWORD == "")
      this.message.error("Please Enter Email Id And Password", "");
    else {
      this.isloginSpinning = true;
      this.api.login(this.EMAIL_ID, this.PASSWORD).subscribe(data => {
        this.isloginSpinning = false;
        if (data['code'] == '200') {
          this.message.success('Successfully Logged In', '')
          this.cookie.set('token', data["data"][0]["token"], 365, "", "", false, "Strict");
          sessionStorage.setItem("userId", data["data"][0]['UserData'][0]['USER_ID'])
          sessionStorage.setItem("userName", data["data"][0]['UserData'][0]['NAME'])
          sessionStorage.setItem("emailId", data["data"][0]['UserData'][0]['EMAIL_ID'])
          sessionStorage.setItem("roleId", data["data"][0]['UserData'][0]['ROLE_ID'])
          sessionStorage.setItem("theatreId", data["data"][0]['UserData'][0]['THEATRE_DETAILS'])
          window.location.reload(); 
        } else {
          this.message.error('You have Entered Wrong Credentials', '')
        }
      }, err => {
        this.isloginSpinning = false;
        this.message.error(JSON.stringify(err), "");
      });
    }
  }

  forgot(): void {
    this.router.navigate(['/forgot'])
  }
}
