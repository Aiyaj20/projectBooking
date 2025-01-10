import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Showlayoutrates } from 'src/app/Models/showlayoutrates';

import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-showlist',
  templateUrl: './showlist.component.html',
  styleUrls: ['./showlist.component.css'],
})
export class ShowlistComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Showlayoutrates = new Showlayoutrates();
  formTitle = 'Show Layout Rates List';
  dataList = [];
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  columns: string[][] = [
    ['DOCUMENT_NAME', 'Document Name '],
    // ["DOCUMENT_NAME_SECONDERY", "Document Name (Marathi)"]
  ];

  constructor(private api: ClientmasterService) {}

  ngOnInit(): void {
    // this.loadingRecords = false;
  }

  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
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
      .getallshowlayoutrates(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          if (this.totalRecords == 0) {
            data.SEQUENCE_NO = 1;
          } else {
            data.SEQUENCE_NO =
              this.dataList[this.dataList.length - 1]['SEQUENCE_NO'] + 1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  add(): void {
    this.drawerTitle = 'Add New Theatrelayout';
    this.drawerData = new Showlayoutrates();

    this.api.getallshowlayoutrates(0, 0, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        // if (data['count'] == 0) {
        //   this.drawerData.SEQUENCE_NO = 1;
        // } else {
        //   this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        // }
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.loadingRecords = true;

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

  edit(data: Showlayoutrates): void {
    this.drawerTitle = ' Update ShowLayout';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
