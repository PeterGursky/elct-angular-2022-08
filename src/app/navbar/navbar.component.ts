import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userName = '';

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.usersService.loggedUser().subscribe(username => {
      this.userName = username;
    });
  }

  logout() {
    this.usersService.logout();
    this.router.navigateByUrl("/login");
  }
}
