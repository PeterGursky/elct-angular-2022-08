import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { CanDeactivateGuard } from 'src/guards/can-deactivate.guard';
import { GroupsResolverService } from 'src/guards/groups-resolver.service';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupsAddComponent } from './groups-add/groups-add.component';
import { GroupsHomeComponent } from './groups-home/groups-home.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsNavbarComponent } from './groups-navbar/groups-navbar.component';

const routes: Routes = [
  {path: '', component: GroupsNavbarComponent,
   children: [
     {path: 'list', component: GroupsListComponent,
      data: {
        title: "Groups list"
      }, 
      resolve: {
        groups: GroupsResolverService
      }},
     {path: 'add', component: GroupsAddComponent, canDeactivate:[CanDeactivateGuard]},
     {path: '', component: GroupsHomeComponent, canActivate:[AuthGuard]},
     {path: ':id', component: GroupDetailComponent}
   ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
