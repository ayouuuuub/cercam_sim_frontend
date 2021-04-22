import { Component, Input, OnChanges, Optional, SimpleChange } from "@angular/core";
import { DataTable1, PageEvent } from "./DataTable";

@Component({
    selector: "mfPaginator1",
    template: `<ng-content></ng-content>`
})
export class Paginator1 implements OnChanges {

    @Input("mfTable") inputMfTable: DataTable1;

    private mfTable: DataTable1;

    public activePage: number;
    public rowsOnPage: number;
    public dataLength = 0;
    public lastPage: number;

    public constructor( @Optional() private injectMfTable: DataTable1) {

    }

    public ngOnChanges(changes: { [key: string]: SimpleChange }): any {
        this.mfTable = this.inputMfTable || this.injectMfTable;
        this.onPageChangeSubscriber(this.mfTable.getPage());
        this.mfTable.onPageChange.subscribe(this.onPageChangeSubscriber);
    }

    public setPage(pageNumber: number): void {
        this.mfTable.setPage(pageNumber, this.rowsOnPage);

    }

    public setRowsOnPage(event): void {
        this.mfTable.setPage(this.activePage, event.target.value, true);
    }

    private onPageChangeSubscriber = (event: PageEvent) => {
        this.activePage = event.activePage;
        this.rowsOnPage = event.rowsOnPage;
        this.dataLength = event.dataLength;
        this.lastPage = Math.ceil(this.dataLength / this.rowsOnPage);

    };
}