import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

export interface Message {
  message: string;
  type: 'success' | 'danger';
} 

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  public errorMessage(message: string): void {
    this.snackBar.open(message, 'ERROR', {panelClass: 'redSnackBar', duration: 4000});
  }

  public successMessage(message: string): void {
    this.snackBar.open(message, 'SUCCESS', {panelClass: 'greenSnackBar', duration: 4000});
  }
}
