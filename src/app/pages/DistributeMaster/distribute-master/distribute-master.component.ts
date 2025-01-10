import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DistributeMaster } from 'src/app/Models/distributeMaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonType } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-distribute-master',
  templateUrl: './distribute-master.component.html',
  styleUrls: ['./distribute-master.component.css'],
})
export class DistributeMasterComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: DistributeMaster = new DistributeMaster();
  formTitle = 'Manage Distributors';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: NzButtonType = 'default';
  screenwidth: any;
  unitWidth = 0;
  filterClass: any = 'filter-invisible';
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMAIL_ID', 'email_Id'],
    ['MOBILE_NUMBER', 'mobile_no'],
    ['ADDRESS', 'address'],
    ['THEATRE_NAME', 'theater_name'],
  ];
  isSpinning = false;
  constructor(private api: ClientmasterService , private message: NzNotificationService) {}

  ngOnInit(): void {
    this.getTheaters()
  }

  keyup(event: any) {
    this.search();
  }

  getTheaters(){
    this.api.getTheatreMaster(0,0,'id','desc','').subscribe(dataa=>{
      if(dataa.code==200){
        this.theaterslist=dataa['data']
      }
      else{
        this.theaterslist=[]
      }
    })
  }
  d:any =[]
  edit(data: any): void {
    this.drawerTitle = "Update Distributor";
    this.drawerData = Object.assign({}, data);
    this.drawerData.ROLE_DATA= data["ROLE_IDS"].split(',');
    var theterLIst:any[] =[]
    this.d  =[]
    if(this.drawerData.THEATRE_ID!=undefined &&this.drawerData.THEATRE_ID!=null &&
      this.drawerData.THEATRE_ID!='' ){

    var theterID= data["THEATRE_ID"].split(',');
    var theterName= data["THEATRE_NAME"].split(',');
    
     theterID.forEach((element:any,index:any) => {
      this.d.push(Number(element))
      theterLIst.push({ID:Number(element),NAME:theterName[index]})
    });
    this.drawerData.THEATRE_ID = this.d;
    

    // this.drawerData.THEATRE_ID = d;



    }
    else{}
    for(var i= 0; i< this.drawerData.ROLE_DATA.length; i++) {
      this.drawerData.ROLE_DATA[i]= Number(this.drawerData.ROLE_DATA[i]);
    }
    this.api
      .getMappedTheatre(0, 0, '', '', '' )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DataList = data['data'];
            this.DataList = [...this.DataList,...theterLIst]
          } else {
            this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.drawerVisible = true;
  }

  roleId:any;
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  isOk=true
  theaterslist:any[]=[]
  theaterid:any
  applyFilter() {
    this.filterQuery=''
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    
    if(this.theaterid!=undefined && this.theaterid!=null && this.theaterid.length>0){
      this.filterQuery=" AND THEATRE_ID in ("+this.theaterid+")"
      this.isOk=true
      this.filterClass = 'filter-invisible';
      this.isFilterApplied='primary'
      this.loadingRecords=false
    }
    else{
      this.filterQuery=''
      this.isOk=false
      this.message.error('Please Select Filter','')
      this.filterClass = 'filter-visible';
      this.loadingRecords=false
    }
  //  else if (
    //   this.type != undefined &&
    //   this.FROM_DATE == undefined &&
    //   this.TO_DATE == undefined
    // ) {
    //   this.filterClass = 'filter-invisible';
    // } 
   
    // else if (this.FROM_DATE == undefined && this.TO_DATE == undefined && this.cityid==undefined) {
    //   this.message.error('', 'Please Selects Dates');
    //   this.loadingRecords = false;
    //   this.isOk=false

    // } 
   
    if(this.isOk) {
      // this.filterQuery = ' ';
      this.filterClass = 'filter-invisible';
      this.search();
    }

    ///local
    // this.api
    //   .getdramaMaster(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     sort,
    //     this.extraFilter+this.filterQuery
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.loadingRecords = false;
    //       this.dataList = data['data'];
    //       this.totalRecords = data['count'];
    //       this.DramaMAsterr = data['data'];
    //       // this.listOfData1 = data['data'];

    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // this.filterClass='filter-invisible';
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    
    // this.cityid=null
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    // this.clickevent('A')
    this.theaterid=null
    this.dataList = [];
    this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      
    }

   

    this.api
      .getDistributeMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          
        },
        (err) => {
          console.log(err);
        }
      );
  }
  DataList:any[]=[]
  add(): void {
    this.drawerTitle = "Create New Distributor";
    this.drawerData = new DistributeMaster();

  this.api
      .getMappedTheatre(0, 0, '', '', '' )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DataList = data['data'];
          } else {
            // this.message.error("Can't Load Theater Name", '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
