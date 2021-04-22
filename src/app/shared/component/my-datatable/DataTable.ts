import {
    Directive, DoCheck, EventEmitter, Input,
    IterableDiffer, IterableDiffers, OnChanges,
    Output, SimpleChange
} from "@angular/core";
import * as _ from "lodash";
import { ReplaySubject } from "rxjs";

export interface SortEvent {
    sortBy: string | string[];
    sortOrder: string
}

export interface PageEvent {
    activePage: number;
    rowsOnPage: number;
    dataLength: number;
}

export interface DataEvent {
    length: number;
}

@Directive({
    selector: 'table[mfData1]',
    exportAs: 'mfDataTable1'
})
export class DataTable1 implements OnChanges, DoCheck {


    private diff: IterableDiffer<any>;
    @Input("mfData1") public inputData: any[] = [];

    @Input("mfSortBy") public sortBy: string | string[] = "id";
    @Input("mfSortOrder") public sortOrder = "asc";
    @Output("mfSortByChange") public sortByChange = new EventEmitter<string | string[]>();
    @Output("mfSortOrderChange") public sortOrderChange = new EventEmitter<string>();

    @Input("mfRowsOnPage") public rowsOnPage = 1000;
    @Input("mfActivePage") public activePage = 1;
    @Input("dataLength") public dataLength = 0;

    private mustRecalculateData = false;

    public data: any[];

    public onSortChange = new ReplaySubject<SortEvent>(1);
    @Output("onPageChange") public onPageChange = new EventEmitter<PageEvent>();

    @Output("onChange") public onChange = new EventEmitter<any>();


    public constructor(private differs: IterableDiffers) {
        this.diff = differs.find([]).create(null);
    }

    public getSort(): SortEvent {
        return { sortBy: this.sortBy, sortOrder: this.sortOrder };
    }

    public setSort(sortBy: string | string[], sortOrder: string): void {
        if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
            this.sortBy = sortBy;
            this.sortOrder = _.includes(["asc", "desc"], sortOrder) ? sortOrder : "asc";
            this.mustRecalculateData = true;
            this.onSortChange.next({ sortBy: sortBy, sortOrder: sortOrder });
            this.sortByChange.emit(this.sortBy);
            this.sortOrderChange.emit(this.sortOrder);
            this.onChange.emit({
                "page": this.activePage,
                "rows": this.rowsOnPage,
                "order": this.sortOrder,
                "field": this.sortBy
            });
        }
    }

    public getPage(): PageEvent {
        return { activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: (this.dataLength > 0 ? this.dataLength : this.inputData.length) };
    }

    public setPage(activePage: number, rowsOnPage: number, changeRow?: boolean): void {

        if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
            this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
            this.rowsOnPage = rowsOnPage;
            if (!this.activePage)
                this.activePage = activePage;

            this.mustRecalculateData = true;
            this.onPageChange.emit({
                activePage: this.activePage,
                rowsOnPage: this.rowsOnPage,
                dataLength: (this.dataLength > 0 ? this.dataLength : this.inputData.length)
            });
            if (this.activePage) {
                if (changeRow) {
                    this.activePage = 1;
                    ////console.log("change");
                }
                this.onChange.emit({
                    "page": this.activePage,
                    "rows": this.rowsOnPage,
                    "order": this.sortOrder,
                    "field": this.sortBy
                });
            }
        }
    }

    private calculateNewActivePage(previousRowsOnPage: number, currentRowsOnPage: number): number {
        const firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
        const newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
        return newActivePage;
    }

    private recalculatePage() {
        const lastPage = Math.ceil(this.dataLength / this.rowsOnPage);
        this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
        this.activePage = this.activePage || 1;

        this.onPageChange.emit({
            activePage: this.activePage,
            rowsOnPage: this.rowsOnPage,
            dataLength: (this.dataLength > 0 ? this.dataLength : this.inputData.length)
        });
    }

    public ngOnChanges(changes: { [key: string]: SimpleChange }): any {
        ////console.log("getPage change", this.activePage)
        ////console.log("_input data change", this.inputData)
        ////console.log(this.sortBy,this.sortOrder)
        if (changes["rowsOnPage"]) {

            this.rowsOnPage = changes["rowsOnPage"].previousValue;
            this.setPage(this.activePage, changes["rowsOnPage"].currentValue);
            this.mustRecalculateData = true;
            ////console.log("rowsOnPage", this.activePage)

        }
        if (changes["sortBy"] || changes["sortOrder"]) {

            if (!_.includes(["asc", "desc"], this.sortOrder)) {
                console.warn("angular2-datatable: value for input mfSortOrder must be one of ['asc', 'desc'], but is:", this.sortOrder);
                this.sortOrder = "asc";
            }
            if (this.sortBy) {
                this.onSortChange.next({ sortBy: this.sortBy, sortOrder: this.sortOrder });
            }
            this.mustRecalculateData = true;
            ////console.log("sortBy", this.activePage)

        }

        if (changes["inputData"] && changes["inputData"].currentValue && changes["inputData"].currentValue.length != 0) {
            this.inputData = changes["inputData"].currentValue || [];
            this.recalculatePage();
            this.mustRecalculateData = true;
            ////console.log("inputData", this.activePage)

        }
        ////console.log("getPage change x", this.activePage)

    }

    public ngDoCheck(): any {

        const changes = this.diff.diff(this.inputData);
        if (changes) {
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
        if (this.mustRecalculateData) {
            this.fillData();
            this.mustRecalculateData = false;
        }
    }

    private fillData(): void {
        const data = this.inputData;
        this.data = data;
    }

    private caseInsensitiveIteratee(sortBy: string) {
        return (row: any): any => {
            let value = row;
            for (const sortByProperty of sortBy.split('.')) {
                if (value) {
                    value = value[sortByProperty];
                }
            }
            if (value && typeof value === 'string' || value instanceof String) {
                return value.toLowerCase();
            }
            return value;
        };
    }
}