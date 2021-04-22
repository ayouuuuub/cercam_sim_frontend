import { NgModule, Optional, SkipSelf } from "@angular/core";
import { SettingsService } from "../services/settings.service";

import { throwIfAlreadyLoaded } from "./module-import-guard";
import { TranslatorService } from "./translator/translator.service";
// import { ThemesService } from "./themes/themes.service";
// import { TranslatorService } from "./translator/translator.service";
// import { MenuService } from "./menu/menu.service";




@NgModule({
  imports: [],
  providers: [
    SettingsService,
    TranslatorService,
  ],
  declarations: [],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
