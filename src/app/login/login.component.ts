import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from './../shared/auth/auth.service';
import { Utilisateur } from './../shared/models/utilisateur.model';
import { UtilisateurService } from './../shared/services/utilisateur.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/component/base-component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ToasterService],
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public authService: AuthService,
    public fb: FormBuilder,
    public toasterService: ToasterService) {
      super();
      this.toasterService = toasterService;
   }

   initForm() {
     this.loginForm = this.fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required],
     })
   }

   ngOnInit(): void {
     this.initForm();
    //  this.enumService.getNivEtudes().subscribe((list) => {
    //    console.log(list);
    //  })
    // let utilisateur:Utilisateur = new Utilisateur();
    // this.utilisateurService.saveUtilisateur(utilisateur).subscribe((user) => {
    //     console.log(user);
    // })
  }
  async submit(valueForm: any) {
    console.log(valueForm);
    await this.authService.login(valueForm.username, valueForm.password)
    .pipe(first())
    .subscribe((result) => {
      console.log(result);
      if(result)
        this.router.navigateByUrl('/exploitation')
    },
    err => this.showCustomError(this.translator.instant("login.message.error")));
  }
}
