import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { mfBootstrapPaginator1 } from './BootstrapPaginator';
import { DataTable1 } from "./DataTable";
import { DefaultSorter1 } from './DefaultSorter';
import { Paginator1 } from './Paginator';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DataTable1,
        DefaultSorter1,
        Paginator1,
        mfBootstrapPaginator1
    ],
    exports: [
        DataTable1,
        DefaultSorter1,
        Paginator1,
        mfBootstrapPaginator1
    ]
})
export class MyDataTableModule {

}