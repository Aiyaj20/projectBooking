import { Component, OnInit } from '@angular/core';

import { formatNumber } from '@angular/common';
import { FormMaster } from 'src/app/Models/form-master'; 
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  formTitle = "Manage Forms";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["PARENT_NAME", "Parent"],["NAME", "Name"], ["LINK", "link"], ["ICON", "Icon"]]

  //drawer Variables
  drawerVisible: boolean=false;
  drawerTitle: string='';
  drawerData: FormMaster = new FormMaster();
  constructor(private api:ClientmasterService) { }

  ngOnInit() {
    this.search();
  }
  // Basic Methods
  sort(sort:any): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      //this.sortKey = "id";
      // this.sortValue = "desc"
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
      likeQuery=likeQuery.substring(0, likeQuery.length - 2)
   
    }
    this.api.getAllForms(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      }, err => {
      console.log(err);
    });
  }


  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
      }

  add(): void {
    this.drawerTitle = "Create New Form";
    this.drawerData = new FormMaster();
    this.drawerVisible = true;
   }
   
  edit(data: FormMaster): void {
    this.drawerTitle = "Update Form Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

}
