import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/entities/auth';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  auth = new Auth("Peter", "upjs");
  
  constructor(private usersService: UsersService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('Auth:', this.auth);
    this.usersService.login(this.auth).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/users');
      }
    });
  }

}
