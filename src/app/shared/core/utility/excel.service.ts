import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as _  from 'lodash';
import { utils, WorkBook, WorkSheet, write } from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): Blob {

    const worksheet: WorkSheet = utils.json_to_sheet(json);
    const workbook: WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): Blob {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    return data;
  }
}
