import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/entities/group';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  groupId?: number;
  group?: Group;

  constructor(private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    // const id = this.route.snapshot.params['id'];
    // this.groupId = +id || undefined;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.groupId = id ? +id : undefined;
      this.usersService.getGroup(this.groupId).subscribe(g => this.group = g);
    });
  }

}
