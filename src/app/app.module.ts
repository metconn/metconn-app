import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { Maps } from './services/maps.service'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptHttpClientModule],
  declarations: [AppComponent],
  providers:[Maps],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
