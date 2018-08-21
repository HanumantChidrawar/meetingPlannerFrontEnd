import { Injectable } from '@angular/core';

//importing socket io
import * as io from 'socket.io-client';
import { Observable, throwError } from 'rxjs';

//for http requests
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = "http://api.meetingplannerapp.hanumantpatil.co";
  private socket;
  public userInfo:any;

  constructor(public http: HttpClient, public appService: AppService) {

    //first step where connection is established. i.e. Handshake moment
    this.socket = io(this.url);
   }

  //events to be listened

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      });//end socket

    });//end return of Observable

  }//end verifyUser

  public messageFromAdmin = (userId) => {

    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);

      });//end socket

    });//end return of Observable

  }//end messageFromAdmin listening to userId of the normal user.


  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      });//end socket

    });//end Observable

  }//end onlineUserList

  public authError = () => {
    return Observable.create((observer) => {

      this.socket.on('auth-error', (data) => {

        observer.next(data);

      })//end socket

    });//end observer

  }//end authError

  public disconnectedSocket = () => {

      this.socket.emit("disconnect", "");//end Socket

  }//end disconnectedSocket

  //end events to be listened

  //events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  }//end setUser 

  public emailNotification = (meetingDetails) => {

    this.socket.emit("email-notification", meetingDetails);

  }//end emailNotification

  public notifyUser = (data) => {

    this.socket.emit("notify-user", data);

  }//end notifyUser

  public exitSocket = () => {

    this.socket.disconnect();

  }//end exit socket



  private handleError(err: HttpErrorResponse) {

    let errorMessage = "";

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }//end if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }//end handleError
}
