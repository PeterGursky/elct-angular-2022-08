import { Pipe, PipeTransform } from '@angular/core';
import { Group } from 'src/entities/group';

@Pipe({
  name: 'groups'
})
export class GroupsPipe implements PipeTransform {

  transform(groups: Group[], options?: string): string {
    if (options === 'permissions') { //all permissions from groups
      const perms: string[] = [];
      for (let group of groups) {
        for (let perm of group.permissions) {
          if (! perms.includes(perm)) {
            perms.push(perm);
          }
        }
      }
      return perms.sort().join(', ');
    } else { 
      return groups.map(group => group.name).join(', ');
    }
  }
}
