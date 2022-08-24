import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { P404Component } from './p404/p404.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: 'groups',
   loadChildren: () => import('../modules/groups/groups.module').then(mod => mod.GroupsModule)
  },
  {path: 'users',
    loadChildren: () => import('../modules/users/users.module').then(mod => mod.UsersModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {path: 'films',
   loadChildren: () => import('../modules/films/films.module').then(mod => mod.FilmsModule)
  },
  {path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch:'full'},
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
