import { HttpClient, HttpParams } from '@angular/common/http';
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

  getTokenHeader(): {
    headers? : {[header: string]: string},
    params?: HttpParams
  } | undefined {
    if (this.token) {
      return { headers: {"X-Auth-Token": this.token}}
    }
    return undefined;
  }

  getFilms(orderBy?: string, descending?: boolean, indexFrom?: number, 
           indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = {...(options || {}), params: new HttpParams()};
    }
    if (options && options.params) {
      if (orderBy) {
        options.params = options.params.set('orderBy', orderBy);
      }
      if (descending) {
        options.params = options.params.set('descending', descending);
      }
      if (indexFrom) {
        options.params = options.params.set('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params = options.params.set('indexTo', indexTo);
      }
      if (search) {
        options.params = options.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.serverUrl+'films', options);
  }

}
