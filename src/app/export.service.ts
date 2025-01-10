import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  multipleTableExportAsExcel(jsonData1: any[], jsonData2: any[], jsonData3: any[], fileName: string): void {
    let wb: XLSX.WorkBook;

    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData1);
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData2);
    const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData3);

    wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Billable');
    XLSX.utils.book_append_sheet(wb, ws2, 'Non Billable');
    XLSX.utils.book_append_sheet(wb, ws3, 'Total');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

}
