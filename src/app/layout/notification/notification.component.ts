import { UtilityService } from 'src/app/shared/core/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/component/base-component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends BaseComponent implements OnInit {
  profilImage: any;
  constructor(
    public utilityService : UtilityService
  ) {
    super();
    console.log(this.currentUser);
  }

  ngOnInit(): void {
    if( this.currentUser && this.currentUser.imgFilename) {
      this.utilityService.downloadImage({filename: this.currentUser.imgFilename}).subscribe((file) => {
        this.createImageFromBlob(file);
      })
    }
  }


  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.profilImage = reader.result;
      // here you can save base64-image to session/localStorage
      //localStorage.setItem('item', this.imageToShow);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


}
