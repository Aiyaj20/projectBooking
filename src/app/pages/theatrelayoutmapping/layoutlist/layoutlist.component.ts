import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Theatrelayoutmapping } from 'src/app/Models/theatrelayoutmapping';
import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-layoutlist',
  templateUrl: './layoutlist.component.html',
  styleUrls: ['./layoutlist.component.css'],
})
export class LayoutlistComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Theatrelayoutmapping = new Theatrelayoutmapping();
  formTitle = 'Theatre Layout Mapping List';
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
    this.loadingRecords = true;
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
      .getallTheatrelayoutmapping(
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
    this.loadingRecords = true;
    this.drawerTitle = 'Add New Theatrelayout';
    this.drawerData = new Theatrelayoutmapping();

    this.api
      .getallTheatrelayoutmapping(0, 0, 'SEQUENCE_NO', 'desc', '')
      .subscribe(
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
    this.loadingRecords = true;
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

  edit(data: Theatrelayoutmapping): void {
    this.drawerTitle = ' Update Layout';
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

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
