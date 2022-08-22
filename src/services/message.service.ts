import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Message {
  message: string;
  type: 'success' | 'danger';
} 

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages$ = new Subject<Message>();

  constructor() { }

  public messages(): Observable<Message> {
    return this.messages$;
  }

  public errorMessage(message: string): void {
    this.messages$.next({message, type: 'danger'});
  }

  public successMessage(message: string): void {
    this.messages$.next({message, type: 'success'});
  }
}
