import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsNavbarComponent } from './groups-navbar/groups-navbar.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsHomeComponent } from './groups-home/groups-home.component';
import { GroupsAddComponent } from './groups-add/groups-add.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    GroupsNavbarComponent,
    GroupsListComponent,
    GroupsHomeComponent,
    GroupsAddComponent,
    GroupDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
