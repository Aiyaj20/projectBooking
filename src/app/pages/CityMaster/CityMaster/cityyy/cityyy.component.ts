import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CityMaster } from 'src/app/Models/citymaster';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-cityyy',
  templateUrl: './cityyy.component.html',
  styleUrls: ['./cityyy.component.css']
})
export class CityyyComponent implements OnInit {

  drawerVisible: boolean=false;
  drawerTitle!: string;
  drawerData: CityMaster = new CityMaster();
  formTitle = "Manage Cities";
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  screenwidth: any;
  unitWidth = 0;
  columns: string[][] = [["NAME", "Name"],[" SEQUENCE_NUMBER", "Sequence No"],["STATUS", "status"]];


  constructor(private api:ClientmasterService) { }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth > 500) {
      this.unitWidth = 400;
    } else {
      this.unitWidth = 380;
    }
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
    // this.loadingRecords = true;
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

    this.api.getCityMaster(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      if(this.totalRecords==0){
        data.SEQUENCE_NUMBER=1;
      }else{
        data.SEQUENCE_NUMBER= this.dataList[this.dataList.length-1]['SEQUENCE_NUMBER']+1
      }
    }, err => {
      console.log(err);
    });
   
  }

     //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = "Create New City";
    this.drawerData = new CityMaster();

  this.api.getCityMaster(1,1,'SEQUENCE_NUMBER','desc','').subscribe (data =>{
    if (data['count']==0){
      this.drawerData.SEQUENCE_NUMBER=1;
    }else
    {
      this.drawerData.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
    }
  },err=>{
    console.log(err);
  })
    this.drawerVisible = true;
  }

  
  edit(data: CityMaster): void {
    this.drawerTitle = "Update City";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords=true;
    const { pageSize, pageIndex, sort} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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


