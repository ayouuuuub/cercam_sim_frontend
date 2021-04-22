/**
 * Created by SoftAjd on 4/21/2017.
 */
import { Component, DoCheck, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'drop-down',
    templateUrl: './my-select.component.html',
    styleUrls: ['./my-select.component.scss']
})
export class MySelectComponent implements OnChanges , DoCheck{


    @Input("source")
    TrueSource: Array<any> = new Array<any>();
    @Input("number-line-resulta-scroll")
    numberline = 10;
    source: Array<any>;
    @Input("path-to-data") pathToData: string;
    @Input("min-chars") minChars = 0;
    @Input("placeholder") placeholder: string;
    @Input("blank-option-text") blankOptionText: string;
    @Input("no-match-found-text") noMatchFoundText = '';
    @Input("accept-user-input") acceptUserInput: boolean;
    @Input("loading-text") loadingText = "Loading";
    @Input("max-num-list") maxNumList: number;
    @Input("show-dropdown-on-init") showDropdownOnInit = false;
    @Input("tab-to-select") tabToSelect = true;
    @Input("match-formatted") matchFormatted = false;
    @Input("multi") multi = "one";
    @Input("label") label: string = null;
    @Input('key') key: string = null;
    @Input("formcontrol") public formcontrol: FormControl = null;
    @Input("disabled") disabled = false;
    @Input("id") id = null;
    @Output("valueChanged") valueChanged = new EventEmitter();

    val: any;
    selected = false;
    ArraySelected: Array<any> = new Array<any>();
    SelectValue: any;
    nameControler:string;
    toasterService: ToasterService;
    constructor(private _sanitizer: DomSanitizer, private renderer: Renderer2, protected toaster: ToasterService) {
        this.toasterService = toaster;
    }


   ngOnInit() {

        if (this.formcontrol) {

                for(const item in this.formcontrol.parent.controls){
                                    if(this.formcontrol===this.formcontrol.parent.controls[item] ){
                                          this.nameControler= item
                                          break;
                                    }
                 }
        }

    }
    ngDoCheck(): void {
        if (this.TrueSource) {

            this.source = this.TrueSource.filter(item => item[this.label] != null);
            if (this.formcontrol.value) {
                if (this.id) {
                    this.source.filter(item => {
                        if (item[this.id] == this.formcontrol.value[this.id]) {
                            this.formcontrol.setValue(item);
                            return true;
                        }
                    })
                }
                this.val = this.formcontrol.value[this.label]

            } else {
                this.val = this.placeholder;
            }
        }
    }
    ngOnChanges(changes: SimpleChanges) {

        if (this.TrueSource) {

            this.source = this.TrueSource.filter(item => item[this.label] != null);

            if (this.formcontrol.value) {

                if (this.id) {
                    this.source.filter(item => {
                        if (item[this.id] == this.formcontrol.value[this.id]) {
                            this.formcontrol.setValue(item);
                            return true;
                        }
                    })
                }
                this.val = this.formcontrol.value[this.label]
            } else {
                this.val = this.placeholder;
            }
        }

    }

    autocompleListFormatter = (data: any): SafeHtml => {

        const html = `<span >${data[this.label]}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    };

    resultaText(event) {
        const a = (this.multi == "tag") ? "tag" : "table";
        switch (this.multi) {
            case a:

                const index = this.source.indexOf(event, 0);
                if (index > -1) {
                    this.source.splice(index, 1);
                    this.ArraySelected.push(event);
                }
                if (this.formcontrol) {
                    this.formcontrol.setValue(this.ArraySelected);
                    this.valueChanged.emit(event);
                }
                this.SelectValue = this.ArraySelected;
                this.selected = false;

                break;
            case "one":
                if (this.formcontrol) {

                    if (event) {
                        this.formcontrol.setValue(this.valueInFormControl(event, this.key));
                        this.SelectValue = this.valueInFormControl(event, this.label);
                    } else {
                        this.formcontrol.setValue(null);
                        this.SelectValue = null;
                    }
                    this.valueChanged.emit(event);
                    this.formcontrol.markAsDirty()
                    this.formcontrol.markAsTouched()
                }
                this.selected = false;
                break;
            default: //console.log("regardez documantation de dropdown"); break;
        }

        this.showDropdownOnInit = false;
    }

    valueInFormControl(data, key): any {
        if (!key) {
            return data
        } else {
            return data[key];
        }


    }

    changedSelect() {
        const a = (this.multi == "tag") ? "tag" : "table";
        switch (this.multi) {
            case a:
                this.selected = true;
                this.showDropdownOnInit = true;
                this.showDropdownOnInit = true;
                break;
            case "one":
                this.selected = true;
                this.showDropdownOnInit = true;
                this.showDropdownOnInit = true;

                break;
            default: //console.log("regardez documantation de dropdown"); break;
        }

    }

    deletitem(param?: any) {

        const a = (this.multi == "tag") ? "tag" : "table";
        switch (this.multi) {
            case a:

                if (param) {
                    const a = this.ArraySelected.find(obj => {
                        return obj.id === param;
                    });

                    const index = this.ArraySelected.indexOf(a, 0);
                    if (index > -1) {
                        this.ArraySelected.splice(index, 1);
                        this.source.push(a);
                    }
                    if (this.formcontrol) {
                        this.formcontrol.setValue(this.ArraySelected);
                    }
                    this.valueChanged.emit(null);
                    this.val = this.ArraySelected;
                    this.selected = false;
                    this.showDropdownOnInit = true;
                }
                break;
            case "one":
                if (this.formcontrol) {
                    this.formcontrol.setValue(null);
                    this.valueChanged.emit(null);
                    this.formcontrol.markAsDirty()
                    this.formcontrol.markAsTouched()
                    this.val = this.placeholder;
                    this.selected = true;
                    this.showDropdownOnInit = true;
                }

                break;
            default: //console.log("regardez documantation de dropdown"); break;
        }

    }
    focusoutselect(event) {
        const a = (this.multi == "tag") ? "tag" : "table";
        switch (this.multi) {
            case a:
                this.val = this.SelectValue;
                this.selected = false;
                this.showDropdownOnInit = false;
                break;
            case "one":
                if (this.formcontrol) {
                    if (this.formcontrol.value == null || this.formcontrol.value == "") {
                        this.formcontrol.setValue(null);
                        this.formcontrol.markAsDirty()
                        this.formcontrol.markAsTouched()
                        this.val = this.placeholder;
                    } else {
                        this.val = this.SelectValue;
                    }
                }
                this.selected = false;
                this.showDropdownOnInit = false;

                break;
            default: //console.log("regardez documantation de dropdown"); break;
        }
    }
    removeall() {
        const a = (this.multi == "tag") ? "tag" : "table";
        switch (this.multi) {
            case a:
                for (const item of this.ArraySelected) {
                    this.source.push(item);
                }
                this.ArraySelected = new Array<any>();
                if (this.formcontrol) {
                    this.formcontrol.setValue(this.ArraySelected);
                }
                this.val = this.ArraySelected;
                break;
        }
    }
}


