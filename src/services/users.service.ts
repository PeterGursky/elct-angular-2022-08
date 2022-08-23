import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, defaultIfEmpty, EMPTY, map, Observable, of, Subscriber, tap } from 'rxjs';
import { Auth } from 'src/entities/auth';
import { Group } from 'src/entities/group';
import { User } from 'src/entities/user';
import { MessageService } from './message.service';

export const DEFAULT_REDIRECT_AFTER_LOGIN="/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  serverUrl = "http://localhost:8080/";
  users: User[] = [new User("JanoService","jano@jano.sk", 1, new Date(),'qwerty'),
                   new User('FeroService','fero@fero.sk',undefined, undefined, undefined),
                   {name: 'HankaService', email: 'hanka@hanka.sk', password: '', active: true, groups: []}]; 
  private userSubscriber?: Subscriber<string>;
  redirectAfterLogin = DEFAULT_REDIRECT_AFTER_LOGIN;

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private router: Router) { }


  set token(token: string | null) {
    if (token)
      localStorage.setItem("token", token);
    else
      localStorage.removeItem("token");
  }

  get token(): string {
    return localStorage.getItem("token") || "";
  }
  
  set userName(userName: string | null) {
    if (userName)
      localStorage.setItem("userName", userName);
    else
      localStorage.removeItem("userName");
    this.userSubscriber?.next(userName || "");
  }

  get userName(): string {
    return localStorage.getItem("userName") || "";
  }

  loggedUser():Observable<string> {
    return new Observable<string>(subsciber => {
      this.userSubscriber = subsciber;
      subsciber.next(this.userName);
    });
  }

  isLoggedIn():boolean {
    return !!this.token;
  }

  isLoggedInAsync(): Observable<boolean> {
    if (!this.isLoggedIn()) return of(false);
    return this.getExtendedUsers().pipe(
      defaultIfEmpty(null),
      map(data => !!data)
    );
  }

  public getLocalUsers(): User[] {
    return this.users;
  }

  public getLocalUsers2(): Observable<User[]> {
    return of(this.users);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverUrl + "users").pipe(
      map(jsonUsers => jsonUsers.map(u => User.clone(u))),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverUrl + "users/" + this.token).pipe(
      map(responseObj => responseObj.map(user => User.clone(user))),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public saveUser(user:User): Observable<User> {
    return this.http.post(this.serverUrl + "users/"+this.token, user).pipe(
      map(user => User.clone(user as User)),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public deleteUser(userId: number):Observable<void> {
    return this.http.delete<void>(this.serverUrl + 'user/' + userId + '/' + this.token).pipe(
      tap(() => this.messageService.successMessage("User successfully deleted")),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public getGroups(): Observable<Group[]> {
    return this.http.get(this.serverUrl + "groups").pipe(
      map( groupsObj => (groupsObj as Group[]).map(group => Group.clone(group))),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public getGroup(id?:number): Observable<Group> {
    return this.http.get(this.serverUrl + "group/" + id).pipe(
      map(groupObj => Group.clone(groupObj as Group)),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public login(auth: Auth):Observable<boolean> {
    return this.http.post(this.serverUrl + 'login', auth, { responseType: 'text' }).pipe(
      map(token => {
        this.token = token;
        this.userName = auth.name;
        this.messageService.successMessage('Login successful');
        return true;
      }),
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  public logout() {
    this.redirectAfterLogin = DEFAULT_REDIRECT_AFTER_LOGIN;
    this.userName = null;
    this.token = null;
  }

  // returns ['name','email'] or ['name'] or ['email'] or []
  userConflicts(user: User): Observable<string[]> {
    return this.http.post<string[]>(this.serverUrl + 'user-conflicts', user).pipe(
      catchError(error => this.httpErrorToMessage(error))
    );
  }

  private httpErrorToMessage(error: any):Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.errorMessage("Cannot connect to server");
      } else {
        if (error.status >= 400 && error.status < 500) {
          const message = error.error.errorMessage || JSON.parse(error.error).errorMessage;
          if (message === "unknown token") {
            this.messageService.errorMessage('Login timeout. You were logged out');
            this.userName = null;
            this.token = null;
            this.router.navigateByUrl("/login");
          } else {
            this.messageService.errorMessage(message);
          }
        } else {
          this.messageService.errorMessage("Server error");
          console.error(error);
        }
        return EMPTY;
      }
    } 
    console.error(error);
    return EMPTY;
  }
}
