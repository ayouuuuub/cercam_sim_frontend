import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { BaseComponent } from "../../../shared/component/base-component";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToasterService } from 'angular2-toaster';
import { UtilisateurService } from "../../../shared/services/utilisateur.service";
import { BusinessModel } from "src/app/shared/models/business-model";
import { Utilisateur } from "src/app/shared/models/utilisateur.model";
import { UtilityService } from "src/app/shared/core/utility/utility.service";
import { FileUploader } from "ng2-file-upload";
declare let myExtObject: any;

@Component({
    selector: 'app-utilisateur-add',
    templateUrl: './utilisateur-add.component.html',
    styleUrls: ['./utilisateur-add.component.scss'],
})
export class UtilisateurAddComponent extends BaseComponent implements OnInit, OnDestroy {

    SelectedRegions = [];
    public subscription: Subscription = new Subscription();
    public utilisateur: Utilisateur;
    public utilisateurForm: FormGroup;
    public saveAndQuit: boolean;
    public profilList: Array<BusinessModel> = [];

    //----declaration des attribut du file import
    public uploader: FileUploader;
    public validFile: boolean;
    public uploadReset = false;
    public imgFilename: string;
    imageToShow: any;

    constructor(public fb: FormBuilder,
        public utilisateurService: UtilisateurService,
        public toasterService: ToasterService,
        public utilityService: UtilityService) {
        super();
        this.toasterService = toasterService;
        this.createForm();
        this.changeFormInvalide(this.utilisateurForm);


        this.uploader = this.utilityService.uploadImage();

        this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
          this.validFile = true;
          this.utilisateurForm.controls['imgFilename'].setValue(this.imgFilename);
        };

        this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
          this.validFile = false;
          this.showError(status, 'common.errors.uploadfile');
        };
        this.uploader.onCompleteItem = (item: any, response: any) => {
          this.imgFilename = response;
          this.utilisateurForm.controls['imgFilename'].setValue(response);
          this.utilityService.downloadTempImage({filename : response}).subscribe((file) => {
            this.createImageFromBlob(file);
          });
        };
        this.uploader.onAfterAddingFile = (file) => {
          this.validFile = true;
          file.withCredentials = false;
          this.validFile = this.validateFile(file._file);
          if (!this.validFile) {
            this.uploader.clearQueue();
          } else {
            if (this.uploader && this.uploader.queue && this.uploader.queue.length > 0) {

              this.imgFilename = this.renameFile(file._file.name);

              this.utilisateurForm.controls['imgFilename'].setValue(this.imgFilename);
              this.uploader.queue[0].file.name = this.imgFilename;
              this.uploader.queue[0].upload();
            }
          }
        };
    }

    ngOnInit() {
        // if (this.hasRole('ROLE_CREATE_UTILISATEUR'))
            this.init();
    //     else
    //         this.showUnauthorizedError(true);
    }

    createImageFromBlob(image: Blob) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
        // here you can save base64-image to session/localStorage
        //localStorage.setItem('item', this.imageToShow);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    }

    init() {
        this.utilisateur = new Utilisateur();
        this.initData();
        this.saveAndQuit = false;
    }

    initData() {
        this.profilList = [];

    }
    createForm() {
        this.utilisateurForm = this.fb.group({
            username: [null, Validators.required],
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            // profil: [null, Validators.required],
            // appartient: [null, Validators.required],
            email: [null, Validators.required],
            adresse: [null],
            description: [null],
            libelle: [null],
            telephone: [null],
            // enabled: [false],
            // responsable: [false],
            password: ['123456'],
            imgFilename: [null]

        });
    }
    saveUtilisateur(utilisateurForm: any) {
        this.validateFormUtilisateur(this.utilisateurForm);
        if (this.utilisateurForm.valid) {
            // if (this.hasRole('ROLE_CREATE_UTILISATEUR')) {
                this.addBusy();

                Object.assign(this.utilisateur, utilisateurForm);
                console.log(this.utilisateur);
                const subscription = this.utilisateurService.saveUtilisateur(this.utilisateur)
                    .subscribe(success => {
                        this.showInfo("common.message.create.info");
                        if (this.saveAndQuit) {
                            const id: number = this.getResponseBody(success);
                            this.router.navigate(['/utilisateur/list']);
                            this.saveAndQuit = false;
                        }
                        this.reset();
                    }, error => this.showError(error.status, JSON.parse(JSON.stringify(error)).message));
                this.subscription.add(subscription);

            // } else {
            //     this.showUnauthorizedError();
            // }
        }
    }

    validateFormUtilisateur(form) {
        this.detectInvalideFormControle(form);
    }

    reset() {
        this.utilisateurForm.reset({ enabled: false, resetPassword: false, profil: null });
        this.resetValidateForm(this.utilisateurForm);
        this.init();


    }



    public ngOnDestroy() {

        this.initData();
        this.subscription.unsubscribe();
    }




}
