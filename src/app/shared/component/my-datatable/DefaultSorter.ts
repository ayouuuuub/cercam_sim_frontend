import { Component, Input, OnInit } from "@angular/core";
import { DataTable1, SortEvent } from "./DataTable";

@Component({
    selector: "mfDefaultSorter1",
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <span *ngIf="isSortedByMeAsc" class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>
            <span *ngIf="isSortedByMeDesc" class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
        </a>`
})
export class DefaultSorter1 implements OnInit {
    @Input("by") sortBy: string;

    isSortedByMeAsc = false;
    isSortedByMeDesc = false;

    public constructor(private mfTable: DataTable1) {
    }

    public ngOnInit(): void {
        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
            this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.mfTable.setSort(this.sortBy, "desc");
        } else {
            this.mfTable.setSort(this.sortBy, "asc");
        }
    }
}