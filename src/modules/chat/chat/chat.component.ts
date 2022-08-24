import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  name = '';
  connected = false;
  message = '';
  @ViewChild('messageInput') messageInput?: ElementRef;
  chatMessages: ChatMessage[] = [];
  connectSubscription?: Subscription;
  greetingSubscription?: Subscription;
  messagesSubscription?: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnDestroy(): void {
    this.disconnect();
  }

  onConnectClick() {
    this.connectSubscription = this.chatService.connect().subscribe(connected => {
      if (connected) {
        this.connected = true;
        this.greetingSubscription = this.chatService.listenGreetings().subscribe(greeting=> {
          this.chatMessages = [new ChatMessage("SERVER",greeting), ...this.chatMessages];
        });
        this.messagesSubscription = this.chatService.listenMessages().subscribe(msg => {
          this.chatMessages = [msg, ...this.chatMessages];
        })
        this.chatService.sendName(this.name);
        setTimeout(()=>this.messageInput?.nativeElement.focus(),0);
      }
    });
  }

  onSendClick() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  disconnect() {
    this.chatService.sendMessage("user is leaving chat...");
    this.greetingSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.connectSubscription?.unsubscribe();
    //this.chatService.disconnect();
    this.connected = false;
  }
}
