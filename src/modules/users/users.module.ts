import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import { MaterialModule } from '../material.module';
import { GroupsPipe } from './pipes/groups.pipe';


@NgModule({
  declarations: [
    UsersComponent,
    GroupsPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UsersRoutingModule
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
