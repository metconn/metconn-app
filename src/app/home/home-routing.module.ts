import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { GoogleMapsModule } from '@nativescript/google-maps/angular';
import { HomeComponent } from './home.component'

const routes: Routes = [
  { path: 'default', component: HomeComponent }
]

@NgModule({
  imports: [GoogleMapsModule,NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule {}
