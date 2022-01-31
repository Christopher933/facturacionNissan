import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { HeaderMainComponent } from './components/header-main/header-main.component';
import { RouterModule } from '@angular/router';
import { SafePipe } from './pipes/safe.pipe';



@NgModule({
  declarations: [
    SpinnerComponent,
    NavigationBarComponent,
    HeaderMainComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    SpinnerComponent,
    NavigationBarComponent,
    HeaderMainComponent,
    SafePipe
  ]
})
export class SharedModule { }
