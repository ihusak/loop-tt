import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import {ChartService} from './chart/chart.service';
import {HttpClientModule} from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';
import { ChartManipulateComponent } from './chart/chart-manipulate/chart-manipulate.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule, MatSortModule, MatTableModule} from '@angular/material';

const appRoutes: Routes = [
  {path: '', component: AppComponent},
  {path: 'chart', component: ChartComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartManipulateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [ChartService],
  bootstrap: [AppComponent],
  exports: [MatSelectModule, MatSortModule]
})
export class AppModule { }
