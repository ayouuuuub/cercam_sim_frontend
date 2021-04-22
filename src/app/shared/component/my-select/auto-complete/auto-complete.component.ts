import {
    AfterViewInit, Component,






    Directive, DoCheck, ElementRef,




    EventEmitter, Input,

    OnInit, Output,



    ViewChild, ViewEncapsulation
} from "@angular/core";
import { timer } from "rxjs";
import { NguiAutoComplete } from "./auto-complete";
declare let $:any;
/**
 * show a selected date in monthly calendar
 * Each filteredList item has the following property in addition to data itself
 *   1. displayValue as string e.g. Allen Kim
 *   2. dataValue as any e.g.
 */
@Component( {
    selector: "ngui-auto-complete",
    template: `
  

  <div #autoCompleteContainer 
    [style.height]="(filteredList.length>10) ? '200px':'' " 
    [style.overflow-x]="(filteredList.length>10) ? 'auto':''" 
    class="ngui-auto-complete" id="scroll_item">
    <!-- keyword input -->
    <input *ngIf="showInputTag"
           #autoCompleteInput 
           class="keyword"
           placeholder="{{placeholder}}"
           (focus)="showDropdownList($event)"
           (blur)="hideDropdownList()"
           (keydown)="inputElKeyHandler($event)"
           (input)="reloadListInDelay($event)"
           [(ngModel)]="keyword" 
           />   
    <!-- dropdown that user can select -->
    <ul *ngIf="dropdownVisible" [class.empty]="emptyList">
      <li *ngIf="isLoading" class="loading"  id="{{loadingText}}">{{loadingText}}</li>
      <li *ngIf="blankOptionText && filteredList.length"
          (mousedown)="selectOne('')" 
          id="{{blankOptionText}}"
          class="blank-item">{{blankOptionText}}</li>
     <li class="default"
            [hidden]="defaultValue==false"
            [ngClass]="{selected: -1=== itemIndex}"
            id="{{placeholder}}"
        (mousedown)="selectOne(null)"
         >{{placeholder}}</li>
      <li class="item"
          *ngFor="let item of filteredList; let i=index;"
          (mousedown)="selectOne(item)"
             id="{{item?.id}}"  
          [ngClass]="{selected: i === itemIndex}"
          [innerHtml]="autoComplete.getFormattedListItem(item)">
      </li>
    </ul>
  </div>`,
    providers: [NguiAutoComplete],
    styles: [`
  @keyframes slideDown {
    0% {
      transform:  translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .ngui-auto-complete {
    background-color: transparent;
  }
  .ngui-auto-complete > input {
    outline: none;
    border: 0;
    padding: 2px; 
    box-sizing: border-box;
    background-clip: content-box;
  }

  .ngui-auto-complete > ul {
    background-color: #fff;
    margin: 0;
    width : 100%;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    border: 1px solid #ccc;
    box-sizing: border-box;
    animation: slideDown 0.1s;
  }
  .ngui-auto-complete > ul.empty {
    display: none;
  }

  .ngui-auto-complete > ul li {
    padding: 2px 5px;
    border-bottom: 1px solid #eee;
  }

  .ngui-auto-complete > ul li.selected {
    background-color: #ccc;
  }

  .ngui-auto-complete > ul li:last-child {
    border-bottom: none;
  }
.default  {
background-color: #fff !important; 
  }
.default :hover {
 background-color: #0275d8 !important; 
 color:#fff !important;
}
  .ngui-auto-complete > ul li:hover {
    background-color: #0275d8 !important;
    color:#fff !important;
  }`
    ],
    encapsulation: ViewEncapsulation.None
})
export class NguiAutoCompleteComponent implements OnInit {

    /**
     * public input properties
     */
    @Input( "list-formatter" ) listFormatter: ( arg: any ) => string;
    @Input( "source" ) source: any;
    @Input( "byAttrib" ) byAttrib: any;
    @Input( "path-to-data" ) pathToData: string;
    @Input( "min-chars" ) minChars = 0;
    @Input( "placeholder" ) placeholder: string;
    @Input( "blank-option-text" ) blankOptionText: string;
    @Input( "no-match-found-text" ) noMatchFoundText: string;
    @Input( "accept-user-input" ) acceptUserInput: boolean;
    @Input( "loading-text" ) loadingText = "Loading";
    @Input( "max-num-list" ) maxNumList: number;
    @Input( "show-input-tag" ) showInputTag = true;
    @Input( "show-dropdown-on-init" ) showDropdownOnInit = false;
    @Input( "tab-to-select" ) tabToSelect = true;
    @Input( "match-formatted" ) matchFormatted = false;
    @Input( "display-property-name" ) displayPropertyName = 'id';
    @Output( "valueSelected" ) valueSelected = new EventEmitter();
    @ViewChild( 'autoCompleteInput' , {static: false}) autoCompleteInput: ElementRef;
    @ViewChild( 'autoCompleteContainer' , {static: false}) autoCompleteContainer: ElementRef;

    el: HTMLElement;           // this component  element `<ngui-auto-complete>`

    dropdownVisible = false;
    isLoading = false;

    filteredList: any[] = [];
    minCharsEntered = false;
    itemIndex = -1;
    keyword: string;
    defaultValue = true;
    isSrcArr(): boolean {
        return ( this.source && this.source.constructor.name === "Array" );
    }

    /**
     * constructor
     */
    constructor(
        elementRef: ElementRef,
        public autoComplete: NguiAutoComplete
    ) {
        this.el = elementRef.nativeElement;
    }

    /**
     * user enters into input el, shows list to select, then select one
     */
    ngOnInit(): void {

        this.autoComplete.source = this.source;
        this.autoComplete.pathToData = this.pathToData;
        this.autoComplete.listFormatter = this.listFormatter;
        setTimeout(() => {
            if ( this.autoCompleteInput ) {
                this.autoCompleteInput.nativeElement.focus()
            }
            if ( this.showDropdownOnInit ) {
                this.showDropdownList( { target: { value: '' } });
            }
        });
    }

    reloadListInDelay = ( evt: any ): void => {
        const delayMs = this.isSrcArr() ? 10 : 500;
        const keyword = evt.target.value;

        // executing after user stopped typing
        this.delay(() => this.reloadList( keyword ), delayMs );
    };

    showDropdownList( event: any ): void {

        this.dropdownVisible = true;

        this.reloadList( event.target.value );
    }

    hideDropdownList(): void {
        this.dropdownVisible = false;
    }

    findItemFromSelectValue( selectText: string ): any {

        const matchingItems = this.filteredList
            .filter( item => ( '' + item.id ) === selectText );
        return matchingItems.length ? matchingItems[0] : null;
    }

    reloadList( keyword: string ): void {

        this.filteredList = [];
        if ( keyword.length < ( this.minChars || 0 ) ) {
            this.minCharsEntered = false;
            return;
        } else {
            this.minCharsEntered = true;
        }
        this.defaultValue = ( keyword.length > 0 ) ? false : true;
        if ( this.isSrcArr() ) {
            let by;// local source
            this.isLoading = false;

            by = keyword;

            this.filteredList = this.autoComplete.filter( this.source, by, this.matchFormatted, this.byAttrib );
            if ( this.maxNumList ) {
                this.filteredList = this.filteredList.slice( 0, this.maxNumList );
            }

        } else {                 // remote source
            this.isLoading = true;

            if ( typeof this.source === "function" ) {
                // custom function that returns observable
                this.source( keyword ).subscribe(
                    resp => {
                        if ( this.pathToData ) {
                            const paths = this.pathToData.split( "." );
                            paths.forEach( prop => resp = resp[prop] );
                        }

                        this.filteredList = resp;
                        if ( this.maxNumList ) {
                            this.filteredList = this.filteredList.slice( 0, this.maxNumList );
                        }
                    },
                    error => null,
                    () => this.isLoading = false // complete
                );
            } else {
                // remote source

                if ( this.source ) {
                    this.autoComplete.getRemoteData( keyword ).subscribe( resp => {
                        this.filteredList = ( <any>resp );
                        if ( this.maxNumList ) {
                            this.filteredList = this.filteredList.slice( 0, this.maxNumList );
                        }
                    },
                        error => null,
                        () => this.isLoading = false // complete
                    );
                } else {
                    this.filteredList = [];
                    this.isLoading = false
                }
            }
        }
    }


    selectOne( data: any ) {

        this.valueSelected.emit( data )
    }

    inputElKeyHandler = ( evt: any ) => {
        const totalNumItem = this.filteredList.length;
        let i
        switch ( evt.keyCode ) {
            case 27: // ESC, hide auto complete
                break;

            case 38: // UP, select the previous li el
                 i=this.itemIndex;
                this.itemIndex = ( totalNumItem + this.itemIndex - 1 ) % totalNumItem;
                this.scrollToView( this.itemIndex ); 
               // console.log(this.itemIndex) 
                break;

            case 40: // DOWN, select the next li el or the first one
                this.dropdownVisible = true;
                 i=this.itemIndex;
                this.itemIndex = ( totalNumItem + this.itemIndex + 1 ) % totalNumItem;
                this.scrollToView( this.itemIndex ); 
                break;
            case 13: // ENTER, choose it!!
            if (this.filteredList.length > 0) { 
                this.selectOne(this.filteredList[this.itemIndex]);
            }
            evt.preventDefault();
            evt.stopPropagation();
            break;

            case 9: // TAB, choose if tab-to-select is enabled
                if ( this.tabToSelect && this.filteredList.length > 0 ) {
                    this.selectOne( this.filteredList[this.itemIndex] );
                }
                break;
        }
       
       
    };


    scrollToView( index ) {
        const container = this.autoCompleteContainer.nativeElement;
        const ul = container.querySelector( 'ul' );
        const li = ul.querySelector( 'li' );  //just sample the first li to get height
        const liHeight = li.offsetHeight;
        const scrollTop = ul.scrollTop;
        const viewport = scrollTop + ul.offsetHeight;
        const scrollOffset = liHeight * index; 
        $("#scroll_item").scrollTop(scrollOffset); 
        if ( scrollOffset < scrollTop || ( scrollOffset + liHeight ) > viewport ) {
            ul.scrollTop = scrollOffset;
      
        }
    }

    get emptyList(): boolean {
        return !(
            this.isLoading ||
            ( this.minCharsEntered && !this.isLoading && !this.filteredList.length ) ||
            ( this.filteredList.length )
        );
    }

    private delay = ( function() {
        let timer$ = timer(0);
        return function( callback: any, ms: number ) {
            timer$ = timer( callback, ms );
        };
    })();

}
@Directive( {
    selector: '[focusOnInit]'
})
export class FocusOnInit implements AfterViewInit, DoCheck {

    constructor( private elementRef: ElementRef ) { }

    ngAfterViewInit() {

    }
    ngDoCheck() {

        this.elementRef.nativeElement.focus();
    }
}