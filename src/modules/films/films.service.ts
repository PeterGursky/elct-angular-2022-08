import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from 'src/entities/film';
import { environment } from 'src/environments/environment';
import { UsersService } from 'src/services/users.service';

export interface FilmsResponse {
  items: Film[],
  totalCount: number
}

@Injectable({
  providedIn: 'any'
})
export class FilmsService {
  serverUrl = environment.serverAddr;

  constructor(private usersService: UsersService, private http: HttpClient) { }

  get token() {
    return this.usersService.token;
  }

  getTokenHeader() {
    if (this.token) {
      return { headers: {"X-Auth-Token": this.token}}
    }
    return undefined;
  }

  getFilms(): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    return this.http.get<FilmsResponse>(this.serverUrl+'films', options);
  }

}
