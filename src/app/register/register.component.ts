import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  passwordMessage = '';
  
  passwordValidator = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.value;
    const result = zxcvbn(pass);
    const message = 'Password strength ' + result.score + '/4 - must be at least 3/4' + 
    '. Guessable in ' + result.crack_times_display.offline_slow_hashing_1e4_per_second;
    this.passwordMessage = message;
    return result.score < 3 ? { weakPassword: message} : null;
  } 

  registerForm = new FormGroup({
    name: new FormControl<string>('',{nonNullable: true, 
                                      validators: [Validators.required, 
                                                   Validators.minLength(3)],
                                      asyncValidators: this.serverConflictValidator('name')
                                     }),
    email: new FormControl<string>('',{nonNullable: true,
                                       validators: [Validators.required, 
                                                    Validators.email,
                                                    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$')
                                                   ],
                                       asyncValidators: this.serverConflictValidator('email')
                                      }),
    password: new FormControl<string>('',{nonNullable: true, 
                                          validators: [Validators.required,
                                                       this.passwordValidator]}),
    password2: new FormControl<string>('',{nonNullable: true}),
  }, this.passwordsMatchValidator);

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  stringify(error: any): string {
    return JSON.stringify(error);
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password?.value === password2?.value) {
      password2?.setErrors(null);
      return null;
    }
    const errors = { differentPasswords: 'Passwords do not match'};
    password2?.setErrors(errors);
    return errors;
  }

  serverConflictValidator(field: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const name = field === 'name' ? control.value : '';
      const email = field === 'email' ? control.value : '';

      const user = new User(name, email);
      return this.usersService.userConflicts(user).pipe(
        map(conflictsArray => {
          if (conflictsArray.length === 0) {
            return null;
          } else {
            return {serverConflict: "this " + field + " is already on the server"};
          }
        })
      );
    }
  }

  onSubmit(){
    const name = this.name.value;
    console.log('name', name);
  }

  get name(): FormControl<string> {
    return this.registerForm.get('name') as FormControl;
  }
  get email(): FormControl<string> {
    return this.registerForm.get('email') as FormControl;
  }
  get password(): FormControl<string> {
    return this.registerForm.get('password') as FormControl;
  }
  get password2(): FormControl<string> {
    return this.registerForm.get('password2') as FormControl;
  }
}
