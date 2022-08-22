import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  usersDataSource = new MatTableDataSource<User>();

  columnsToDisplay = ['id', 'name', 'email', 'lastLogin', 'active', 'groups'];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.usersService.getExtendedUsers().subscribe(users => {
      this.usersDataSource.data = users;
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    });
  }

}
