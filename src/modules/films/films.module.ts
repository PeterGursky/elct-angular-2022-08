import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmsComponent } from './films/films.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    FilmsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FilmsRoutingModule
  ]
})
export class FilmsModule { }
