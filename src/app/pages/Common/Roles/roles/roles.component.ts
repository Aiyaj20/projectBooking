import { Component, OnInit } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { RoleMaster } from 'src/app/Models/role-master';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  formTitle = 'Manage Roles';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PARENT_ROLE_NAME', 'Parent'],
    ['NAME', 'Name'],
    ['DESCRIPTION', 'Description'],
    ['TYPE', 'Type'],
  ];

  //drawer Variables
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: RoleMaster = new RoleMaster();
  drawerVisible1: boolean = false;
  drawerTitle1: string = '';
  drawerData1: RoleMaster = new RoleMaster();
  drawerData2: string[] = [];

  constructor(private api: ClientmasterService) {}

  ngOnInit() {
    this.search();
  }
  // Basic Methods
  sort(sort: any): void {
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
      .getAllRoles(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
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

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Roles';
    this.drawerData = new RoleMaster();
    this.drawerVisible = true;
  }

  edit(data: RoleMaster): void {
    this.drawerTitle = 'Update Roles Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  MapForms(data: RoleMaster): void {
    this.api.getRoleDetail(data.ID).subscribe(
      (data) => {
        this.drawerData2 = data['data'];
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerTitle1 = 'Forms assign for ' + data.NAME + '';
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
}
