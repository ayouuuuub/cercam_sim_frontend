import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../../component/base-component";

@Component( {
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent extends BaseComponent implements OnInit {


    @Input() title: string;
    @Input() description: string;

    constructor() {
        super();
    }

    ngOnInit() {
    }
}