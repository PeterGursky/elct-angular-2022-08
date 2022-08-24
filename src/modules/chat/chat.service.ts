import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/services/message.service';
import { Client, over } from 'stompjs';

@Injectable({
  providedIn: 'any'
})
export class ChatService {
  server = environment.chatWs;
  socket?: WebSocket;
  stompClient? : Client;
  name = '';

  constructor(private messageService: MessageService) { }

  connect(): Observable<boolean> {
    this.socket = new WebSocket(this.server);
    this.stompClient = over(this.socket);

    return new Observable(subscriber => {
      this.stompClient?.connect({}, frame => {
        subscriber.next(true);
        this.messageService.successMessage("Connected to chat server");
      }, error => {
        subscriber.next(false);
        this.messageService.errorMessage("Not connected to chat server");
      });
      return {
        unsubscribe: () => {
          this.disconnect();
        }
      }
    });
  }

  sendName(name: string):void {
    this.name = name;
    this.stompClient?.send('/app/hello',{},'{"name":"'+ name +'"}')
  }

  sendMessage(message: string) {
    const msg = new ChatMessage(this.name, message);
    this.stompClient?.send('/app/message',{},JSON.stringify(msg));
  }

  listenGreetings(): Observable<string> {
    return new Observable(subscriber => {
      this.stompClient?.subscribe('/topic/greetings', msgBody =>{
        subscriber.next(JSON.parse(msgBody.body).content);
      });
    });
  }

  listenMessages(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      this.stompClient?.subscribe('/topic/messages', msgBody =>{
        subscriber.next(JSON.parse(msgBody.body));
      });
    });
  }

  disconnect() {
    this.stompClient?.disconnect(()=>{});
  }

 }

 export class ChatMessage {
   constructor(
     public name: string,
     public message: string
   ){}
 }