import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { appkeys } from '../app.constant';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class ClientmasterService {
  Baseurl = appkeys.baseUrl;
  url = appkeys.url;
  url1 = appkeys.url1;

  clientId = 1;

  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  loggerUrl = appkeys.gmUrl;

  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  constructor(public httpClient: HttpClient, public cookie: CookieService) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = Math.floor(100000 + Math.random() * 900000);

      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '',
        '',
        false,
        'Strict'
      );
      //localStorage.setItem("deviceId",deviceId.toString())
    }

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',

      deviceid: this.cookie.get('deviceId'),
      visitorid: this.cookie.get('visitorId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  logoutForSessionValues() {
    this.cookie.delete('supportKey');
    this.cookie.delete('token');
    sessionStorage.clear();
    window.location.reload();
  }

  //get all any For login menu
  getForms(roleId: number) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<any>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getCheckAccessOfForm(roleId: number, link: string) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      ROLE_ID: roleId,
      LINK: link,
    };
    return this.httpClient.post<any>(
      this.url + 'roleDetails/checkAccess',
      JSON.stringify(data),
      this.options
    );
  }

  login(email: string, password: string) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   // 'visitorid':this.cookie.get('visitorId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   // 'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      username: email,
      password: password,
      // cloudid:this.cloudID,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }

  requestPermission(userId: string) {
    // this.angularFireMessaging.requestToken.subscribe(
    //   (token) => {
    //     this.cloudID=token
    //    //this.updateToken(userId, token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  httpHeaders2 = new HttpHeaders({
    Accept: 'application/json',
    // 'apikey': '9876543210',
    ////// For Local ///////
    // apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',

    /////For Testing ////////
    apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',

    Token: this.cookie.get('token'),
  });
  options2 = {
    headers: this.httpHeaders2,
  };

  //////////////////// Function for headers start ///////////
  getheader() {
    ////// For Local /////

    // this.httpHeaders = new HttpHeaders({
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'application/json',
    //   apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   applicationkey: '7PnFgUYX2Z5ApKJu',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    /////For Testing ////////

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }
  //////////////////// Function for headers end ///////////

  loggerheader() {
    //////////For Local////////////////

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   applicationkey: '7PnFgUYX2Z5ApKJu',
    //   deviceid: this.cookie.get('deviceId'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    ///////For Testing /////////////////

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  onuploadheader() {
    ////////For Local /////////

    // this.httpHeaders1 = new HttpHeaders({
    //   Accept: 'application/json',
    //   apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   applicationkey: '7PnFgUYX2Z5ApKJu',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };

    ////////////For Testing //////////

    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
  }

  loggerInit() {
    this.loggerheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   // 'apikey': 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    //   // 'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),

    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      CLIENT_ID: this.clientId,
    };
    return this.httpClient.post<any>(
      this.loggerUrl + 'device/init',
      JSON.stringify(data),
      this.options
    );
  }

  getAllForms(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'form/get',
      JSON.stringify(data),
      this.options
    );
  }

  createForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'form/create/',
      JSON.stringify(form),
      this.options
    );
  }

  updateForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'form/update/',
      JSON.stringify(form),
      this.options
    );
  }

  //methods for role related opearation  - ROLE
  getAllRoles(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'role/get',
      JSON.stringify(data),
      this.options
    );
  }

  createRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'role/create/',
      JSON.stringify(application),
      this.options
    );
  }

  updateRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'role/update/',
      JSON.stringify(application),
      this.options
    );
  }

  //get all form assigned - ROLE_DETAILS
  getRoleDetail(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };

    return this.httpClient.post<any>(
      this.url + 'roleDetail/getData',
      JSON.stringify(data),
      this.options
    );
  }

  //assign all method forms - ROLE_DETAILS
  addRoleDetail(roleId: number, data1: string[]): Observable<any> {
    var data = {
      ROLE_ID: roleId,
      data: data1,
    };
    return this.httpClient.post<any>(
      this.url + 'roleDetail/addBulk',
      data,
      this.options
    );
  }

  //method for user replated opearation - USER
  getAllUsers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'user/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.post<any>(
      this.url + 'user/create/',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.put<any>(
      this.url + 'user/update/',
      JSON.stringify(user),
      this.options
    );
  }

  //Image Upload Function
  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.onuploadheader();

    const fd = new FormData();

    fd.append('Image', selectedFile, filename);

    return this.httpClient.post<any>(
      appkeys.imgUrl + folderName,
      fd,
      this.options1
    );
  }

  /////Export to excel
  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  //Theatre layout

  getallTheatrelayout(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTheatrelayout(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutMapping/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateTheatrelayout(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'theatreLayoutMapping/update',
      JSON.stringify(role),
      this.options
    );
  }

  getallTheatrelayoutmapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutSeatMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTheatrelayoutmapping(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutSeatMapping/createSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }

  updateTheatrelayoutmapping(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutSeatMapping/updateSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }

  // Show Layout Rates
  getallshowlayoutrates(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutRates/get',
      JSON.stringify(data),
      this.options
    );
  }

  createshowlayoutrates(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutRates/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateshowlayoutrates(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'showLayoutRates/update/',
      JSON.stringify(role),
      this.options
    );
  }
  //Show Layout Mapping
  getallshowlayoutmapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutSeatMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createshowlayoutmapping(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutSeatMapping/createSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }

  updateshowlayoutmapping(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutSeatMapping/updateSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }

  //Cart Master
  getallcartmaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'Aboutus/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createcartmaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'Aboutus/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatecartmaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'Aboutus/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //cardseatdetails
  getallcardseatdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'Aboutus/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createcardseatdetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'Aboutus/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatecardseatdetails(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'Aboutus/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //showseatbookingdetails
  getallshowseatbookingdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showSeatBookingDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  createshowseatbookingdetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'Aboutus/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateshowseatbookingdetails(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'Aboutus/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Thearemaster

  getAllThearemaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'theatre/get',
      JSON.stringify(data),
      this.options
    );
  }

  createThearemaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateThearemaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'theatre/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Seatlayoutgrpnames
  getAllSeatlayoutgrpnames(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'seatLayoutGroupNames/get',
      JSON.stringify(data),
      this.options
    );
  }

  createSeatlayoutgrpnames(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'seatLayoutGroupNames/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateSeatlayoutgrpnames(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'seatLayoutGroupNames/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Website Banner Master

  getAllwebsiteBanner(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'websiteBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createwebsiteBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'websiteBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatewebsiteBanner(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'websiteBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Master

  getAllProductMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  // Category Master

  getAllCategoryMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'category/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCategoryMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'category/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCategoryMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'category/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // Blog Master

  getAllBlogMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'blogs/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createBlogMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'blogs/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateBlogMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'blogs/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // New Subscriber Report

  getAllNewSubscriberReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'newsSubscribers/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // User Contact Report

  getAllUserContactReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'userContact/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //  Image Get

  getAllImages(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productImages/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateImages(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'productImages/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Ad Banner Master

  getAllAdBanner(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'adBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAdBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'adBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAdBanner(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'adBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Unit Master

  getAllUnitMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'unit/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUnitMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'unit/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateUnitMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'unit/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Mapping

  getAllProductMapped(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductMap(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMap(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  getAllCartaddon(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cartAddon/details/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //cartaddon master
  getAllCartAddOnMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cartAddon/master/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCartAddOnMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'cartAddon/master/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createCartAddOnMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cartAddon/master/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //CartItem
  getAllCartItem(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cartItem/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //CartMaster

  getAllCartMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cart/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // Product Master

  getAllProductVarient(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productVarient/mapping/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductVarient(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productVarient/mapping/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductVarient(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'productVarient/mapping/update',
      JSON.stringify(role),
      this.options
    );
  }

  //city master

  getCityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'city/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCityMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'city/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCityMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'city/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //theatre Master

  getTheatreMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getTheatreCounts(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/getTheatreCount',
      JSON.stringify(data),
      this.options
    );
  }
  createTheatreMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateTheatreMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'theatre/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //drama Master

  getdramaMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'dramaMaster/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getDramaCounts(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'dramaMaster/getDramaCount',
      JSON.stringify(data),
      this.options
    );
  }
  getdramaMasterForReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getDramas/',
      JSON.stringify(data),
      this.options
    );
  }

  createDramaMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'dramaMaster/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateDramaMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'dramaMaster/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getSeatCounts(
   
    THEATRE_ID:Number
  ): Observable<any> {
    var data = {
      THEATRE_ID:THEATRE_ID
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/getTheatreSeatCount',
      JSON.stringify(data),
      this.options
    );
  }

  //SeatLayoutgroup Master

  getSeatLayoutMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'seatLayoutGroupNames/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createSeatLayoutMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'seatLayoutGroupNames/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateSeatLayoutMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'seatLayoutGroupNames/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //show Master

  getmaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getmasterscount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getShowCounts',
      JSON.stringify(data),
      this.options
    );
  }
  createDatamaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'showMaster/createShow/',
      JSON.stringify(role),
      this.options
    );
  }
  updatedatamaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'showMaster/updateShow',
      JSON.stringify(role),
      this.options
    );
  }

  //cartseatdetails

  getCartSeatDetailsMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartSeatDetails/get/',
      JSON.stringify(data),
      this.options
    );
  }
  //Cart Master

  getCartMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartMaster/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCartMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartMaster/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCartMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'cartMaster/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // DeleteLayout
  deletebookingmaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutMapping/deleteLayout',
      JSON.stringify(role),
      this.options
    );
  }

  // Delete Seat Layout
  deleteseatdeatils(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutSeatMapping/deleteSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }

  deleteseatdeatils2(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutSeatMapping/deleteSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }


  deleteTheatreSeatBulk(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatreLayoutSeatMapping/deleteBulkSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }


  deleteShowSeatBulk(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showLayoutSeatMapping/deleteBulkSeatLayout',
      JSON.stringify(role),
      this.options
    );
  }
  //Image get for booking

  getallshowseatbookingdetailsimage1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'getSeatLayout/',
      JSON.stringify(data),
      this.options
    );
  }

  //Images

  getallshowseatbookingdetailsimage(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    showid: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      show_id: showid,
    };

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
      api_key: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    });
    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'showMaster/getSeatLayoutOfBookingDetails',
      JSON.stringify(data),
      this.options
    );
  }

  //layout group name image

  assignShowlayout(SHOW_ID:number,THEATRE_ID:number):Observable<any>{
    var data={
      SHOW_ID:SHOW_ID,
      THEATRE_ID:THEATRE_ID
    }
    return this.httpClient.post<any>(
      this.url + 'showMaster/mapShowLayout',
      JSON.stringify(data),
      this.options
    );
  }
  getlayoutgroupnameseatimage(
    THEATRE_LAYOUT_MAPPING_ID: number,
    THEATRE_ID: number
  ): Observable<any> {
    var data = {
      THEATRE_LAYOUT_MAPPING_ID: THEATRE_LAYOUT_MAPPING_ID,
      THEATRE_ID: THEATRE_ID,
      // THEATRE_ID:,
      // THEATRE_LAYOUT_MAPPING_ID:
    };

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
      api_key: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    });
    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'showMaster/getPreviewImage',
      JSON.stringify(data),
      this.options
    );
  }
  getlayoutgroupnameseatimage2(
    THEATRE_LAYOUT_MAPPING_ID: number,
    THEATRE_ID: number,
    SHOW_ID:number
  ): Observable<any> {
    var data = {
      THEATRE_LAYOUT_MAPPING_ID: THEATRE_LAYOUT_MAPPING_ID,
      THEATRE_ID: THEATRE_ID,
      SHOW_ID:SHOW_ID
      // THEATRE_ID:,
      // THEATRE_LAYOUT_MAPPING_ID:
    };

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
      api_key: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    });
    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'showMaster/getPreviewImagenew',
      JSON.stringify(data),
      this.options
    );
  }
  getshowlayoutimage(THEATRE_ID: number): Observable<any> {
    var data = {
      THEATRE_ID: THEATRE_ID,
      // THEATRE_ID:,
      // THEATRE_LAYOUT_MAPPING_ID:
    };

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
      applicationkey: '7PnFgUYX2Z5ApKJu',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
      api_key: 'CBZG8K8jWyjpEJOymwKoeuTy0RBYlLoA',
    });
    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'showMaster/getPreviewImage',
      JSON.stringify(data),
      this.options
    );
  }

  //reports
  getbookingsdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getShowReport',
      JSON.stringify(data),
      this.options
    );
  }

  getcartreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartMaster/getCartReport',
      JSON.stringify(data),
      this.options
    );
  }

  getshowdetailsreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getShowReport',
      JSON.stringify(data),
      this.options
    );
  }

  getcitywisetheaterreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/getCityWiseTheatreReport',
      JSON.stringify(data),
      this.options
    );
  }

  getcitywiseshowreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getCityWiseShowReport',
      JSON.stringify(data),
      this.options
    );
  }

  gettheaterwiseshowreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/getTheatreWiseShowReport',
      JSON.stringify(data),
      this.options
    );
  }
  gethospital(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hospital/get',
      JSON.stringify(data),
      this.options
    );
  }

  createhospital(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'hospital/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatehospital(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'hospital/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // uodateaddbulkcall(role: any, data:any): Observable<any> {
  //   this.getheader();
  //   return this.httpClient.put<any>(
  //     this.url + 'city/update/',
  //     JSON.stringify(role),
  //     this.options
  //   );
  // }

  updateaddbulkcall(
    THEATRE_LAYOUT_MAPPING_ID: number,
    ROW_NAME: any,
    data1: any
  ): Observable<any> {
    var data = {
      THEATRE_LAYOUT_MAPPING_ID: THEATRE_LAYOUT_MAPPING_ID,
      ROW_NAME: ROW_NAME,
      data1: data1,
    };

    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'theatreLayoutSeatMapping/updateBulk',
      JSON.stringify(data),
      this.options
    );
  }
  producrsurl = 'https://jsonplaceholder.typicode.com/users';
  products(): Observable<any> {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/users');
  }

  getcategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'showMaster/getCategoryWiseReport',
      JSON.stringify(data),
      this.options
    );
  }
  getshow(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'cartMaster/getShowWiseBookingReport',
      JSON.stringify(data),
      this.options
    );
  }
  getcarttransaction(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'cartMaster/getTrasactionReport',
      JSON.stringify(data),
      this.options
    );
  }
  getShowSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartMaster/getShowSummaryReport',
      JSON.stringify(data),
      this.options
    );
  }

  getMappedTheatre(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'theatre/getTheatre',
      JSON.stringify(data),
      this.options
    );
  }
  getDistributeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'user/get',
      JSON.stringify(data),
      this.options
    );
  }
  userTheatreMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'userTheatreMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateDistributedMaster(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.put<any>(
      this.url + 'user/update',
      JSON.stringify(role),
      this.options
    );
  }

  createDistrubutedMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'user/create/',
      JSON.stringify(role),
      this.options
    );
  }
  checkSeatAvailableOrNot(
    SHOW_ID:number,
    THEATRE_ID:number
  ): Observable<any> {
    var data = {
      SHOW_ID:SHOW_ID,
      THEATRE_ID:THEATRE_ID
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'showMaster/checkRowAvailableOrNot',
      JSON.stringify(data),
      this.options
    );
  }

  getOfflineBookingData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cartMaster/getOfflineBookings',
      JSON.stringify(data),
      this.options
    );
  }


  confirmOfflineBooking(role: any): Observable<any> {
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'dramaMaster/updateAdminConfirmationStatus',
      JSON.stringify(role),
      this.options
    );
  }
// Cast Master

  getCasteMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cast/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getCastemasterscount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'cast/get',
      JSON.stringify(data),
      this.options
    );
  }
  createCastemaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cast/create/',
      JSON.stringify(role),
      this.options
    );
  }
  updateCastemaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'cast/update',
      JSON.stringify(role),
      this.options
    );
  }
}
