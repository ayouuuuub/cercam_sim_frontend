import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../shared/component/base-component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToasterConfig, ToasterService } from 'angular2-toaster';

import { CustomValidators } from 'ng2-validation';
import { Utilisateur } from '../../../shared/model/utilisateur.model';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';

@Component({
  selector: 'app-changemotpasse',
  templateUrl: './changemotpasse.component.html',
  styleUrls: ['./changemotpasse.component.scss'],
  providers: [ToasterService]
})

export class ChangemotpasseComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup;
     utilisateur: Utilisateur;
     toasterconf: ToasterConfig = new ToasterConfig( {
        positionClass: 'toast-top-right',
        showCloseButton: true
    });
  @Input() changeDefaultPassword: boolean
  constructor(  private fb: FormBuilder, protected utilisateurService: UtilisateurService, private toaster: ToasterService ) {
    super();
    const password = new FormControl( null, Validators.required );
    const confirmPassword = new FormControl( null, Validators.required );
    this.loginForm = fb.group( {
        'oldPassword': [null],
        'newPassword': password,
        'confirmPassword': confirmPassword
    } );
  }

  ngOnInit() {
    if ( !this.changeDefaultPassword ) {
      this.loginForm.controls['oldPassword'].setValidators( [Validators.required] );
    }
    else {
      this.loginForm.controls['oldPassword'].setValidators( [] );
    }
  }

  changePassword( loginForm: any ) {
  // console.log(loginForm)
  // console.log(this.getCurrentUser())
  this.loginForm.controls['newPassword'].setValidators( Validators.compose( [Validators.minLength( 6 ), Validators.required] ) );
  this.loginForm.controls['newPassword'].updateValueAndValidity();
  const password = this.loginForm.controls['newPassword'];
  this.loginForm.controls['confirmPassword'].setValidators( Validators.compose( [Validators.required, Validators.minLength( 6 ), CustomValidators.equalTo( password )] ) );
  this.loginForm.controls['confirmPassword'].updateValueAndValidity();


  if ( this.loginForm.valid ) {
      this.addBusy();
      this.utilisateur = new Utilisateur();
      Object.assign( this.utilisateur, loginForm );
      this.utilisateur.id = this.getCurrentUser().id;
      this.utilisateur.resetPassword = this.changeDefaultPassword;
      this.utilisateurService.updateUtilisateurPassword( this.utilisateur )
          .subscribe( success => {
              // this.showInfo( "common.message.update.info" );
              this.showInfo("common.message.resetPassword.info");
              // this.showInfo("common.message.create.info");
              this.router.navigate( ['/login'], { queryParams: { logout: "logout" } } );
          }, error => this.showError( error.status, error.json().message ) );
  }

}

showError( status: number, message: string | any ) {
    this.removeBusy();
    this.toaster.pop( 'error', 'Erreur', this.translator.instant( message ) );
}

showInfo( info: string | any ) {
    this.removeBusy();
    this.toaster.pop( 'success', this.translator.instant( 'common.text.info' ), this.translator.instant( info ) );
}

}
