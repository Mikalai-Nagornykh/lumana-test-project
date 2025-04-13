import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<string>();

  public messages$ = this.messageSubject.asObservable();

  constructor() {}

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connection established');
    };

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('Error WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.warn('Connection closed');
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('Socket is not open. Unable to send message:', message);
    }
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
