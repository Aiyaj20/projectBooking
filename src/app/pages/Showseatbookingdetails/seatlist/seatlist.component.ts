import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Showseatbookingdetail } from 'src/app/Models/showseatbookingdetails';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-seatlist',
  templateUrl: './seatlist.component.html',
  styleUrls: ['./seatlist.component.css']
})
export class SeatlistComponent implements OnInit {

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Showseatbookingdetail = new Showseatbookingdetail();
  formTitle = "  Show Seat Booking List";
  dataList = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  datacount:any;
  columns: string[][] = [["EMAIL_ID"," Email ID"], ["CONTACT_NO"," Contact Number"],
  ["WHATSAPP_NO","Whatsapp Number"] ,["LONGITUDE  ", " Longitude "], ["LATITUDE"," Latitude"]];

  constructor(private api: ClientmasterService) { } 

  ngOnInit(): void {
  // this.loadingRecords = false;

  }

  keyup(event:any) {
    this.search();
  }
  
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc"
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    var likeQuery = "";
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
    }
    this.api.getallshowseatbookingdetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.datacount = data['count'];
      // alert(this.datacount)
      this.dataList = data['data'];
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NO=1;
      // }
    }, err => {
      console.log(err);
    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = " Add New  Show Seat Booking ";
    this.drawerData = new Showseatbookingdetail();
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  edit(data: Showseatbookingdetail): void {
    this.drawerTitle = " Update  Show Seat Booking  ";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
sort(params: NzTableQueryParams): void {
  this.loadingRecords=true;
    const { pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id'; 
    // const sortOrder = (currentSort && currentSort.value) || 'asc';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if(this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }    
    
    if( this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize =pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
}
