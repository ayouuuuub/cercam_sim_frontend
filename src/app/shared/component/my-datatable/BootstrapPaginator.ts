import { Component, Input, OnChanges } from "@angular/core";
import * as _ from "lodash";
import { DataTable1 } from './DataTable';

@Component({
    selector: "mfBootstrapPaginator1",
    template: `
    <mfPaginator1 #p [mfTable]="mfTable" style="margin:0px;padding:0px">
        <ul class="pagination" *ngIf="p.dataLength > 0" style="margin:0px;padding:0px">
            <li class="page-item" *ngIf="p.dataLength > p.rowsOnPage" [class.disabled]="p.activePage <= 1" (click)="p.setPage(1)">
                <a class="page-link" style="cursor: pointer">&laquo;</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 4 && p.activePage + 1 > p.lastPage" (click)="p.setPage(p.activePage - 4)">
                <a class="page-link" style="cursor: pointer">{{p.activePage-4}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 3 && p.activePage + 2 > p.lastPage" (click)="p.setPage(p.activePage - 3)">
                <a class="page-link" style="cursor: pointer">{{p.activePage-3}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 2" (click)="p.setPage(p.activePage - 2)">
                <a class="page-link" style="cursor: pointer">{{p.activePage-2}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 1" (click)="p.setPage(p.activePage - 1)">
                <a class="page-link" style="cursor: pointer">{{p.activePage-1}}</a>
            </li>
            <li class="page-item active" *ngIf="p.dataLength > p.rowsOnPage">
                <a class="page-link" style="cursor: pointer">{{p.activePage}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 1 <= p.lastPage" (click)="p.setPage(p.activePage + 1)">
                <a class="page-link" style="cursor: pointer">{{p.activePage+1}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 2 <= p.lastPage" (click)="p.setPage(p.activePage + 2)">
                <a class="page-link" style="cursor: pointer">{{p.activePage+2}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 3 <= p.lastPage && p.activePage < 3" (click)="p.setPage(p.activePage + 3)">
                <a class="page-link" style="cursor: pointer">{{p.activePage+3}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 4 <= p.lastPage && p.activePage < 2" (click)="p.setPage(p.activePage + 4)">
                <a class="page-link" style="cursor: pointer">{{p.activePage+4}}</a>
            </li>
            <li class="page-item" *ngIf="p.dataLength > p.rowsOnPage" [class.disabled]="p.activePage >= p.lastPage" (click)="p.setPage(p.lastPage)">
                <a class="page-link" style="cursor: pointer">&raquo;</a>
            </li>
             <li class="page-item" *ngIf="p.dataLength > 10">
                <select  class="form-control" style=" display: inline-block; width:auto;margin-left:20px;" (change)="p.setRowsOnPage($event)">
                    <option *ngFor="let rows of rowsOnPageSet" [value]="rows" [selected]="p.rowsOnPage == rows">{{rows}}</option>
                </select>
            </li>
        </ul>
    </mfPaginator1>
    `
})
export class mfBootstrapPaginator1 implements OnChanges {
    @Input("rowsOnPageSet") rowsOnPageSet = [];
    @Input("mfTable") mfTable: DataTable1;

    minRowsOnPage = 0;

    ngOnChanges(changes: any): any {
        if (changes.rowsOnPageSet) {
            this.minRowsOnPage = _.min(this.rowsOnPageSet)
        }
    }
}