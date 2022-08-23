import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverService implements Resolve<Group[]>{

  constructor(private usersService: UsersService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Group[] | Observable<Group[]> {
    return this.usersService.getGroups();
  }
}
