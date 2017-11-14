import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UISpinDropdown } from './ui-spindropdown.component';

@NgModule({
  declarations: [
    AppComponent, UISpinDropdown
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
