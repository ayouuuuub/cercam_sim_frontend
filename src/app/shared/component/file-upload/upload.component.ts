import { Component, Input, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component( {
    selector: 'file-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    @Input() uploader: FileUploader;

    @Input() uploadReset: boolean;

    public hasBaseDropZoneOver = false;
    //public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    // public fileOverAnother(e: any): void {
    //     this.hasAnotherDropZoneOver = e;
    // }

    public constructor() { }

    public ngOnInit(): void {
        this.formUpload.nativeElement.value = "";
    }

    @ViewChild('formUpload', {static: false})
    formUpload: any;

    private onChange(event: any): void {
        this.formUpload.nativeElement.value = "";
    }

    formReset(){
        this.formUpload.nativeElement.value = "";
    }

    ngOnChanges(changes: SimpleChanges) {
        const uploadReset: SimpleChange = changes['uploadReset'];
        if (uploadReset) {
            if (uploadReset.currentValue) {
                this.formUpload.nativeElement.value = "";
            }

        }
    }

}