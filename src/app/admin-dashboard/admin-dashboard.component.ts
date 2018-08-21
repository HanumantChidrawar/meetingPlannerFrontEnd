import { Component, OnInit } from '@angular/core';

//for routing
import { ActivatedRoute, Router } from '@angular/router';
//import for services
import { AppService } from '../app.service';
import { SocketService } from '../socket.service';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';

import { DragAndDropModule } from 'angular-draggable-droppable';


import {

  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { CalendarModule } from 'angular-calendar';

const colors: any = [
  {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
];

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('alertContent') alertContent: TemplateRef<any>;
  view: string = 'month';

  viewDate: Date = new Date();

  public authToken: any;
  public receiverId: String;
  public receiverName: String;
  public userInfo: any;
  public allUsers: any = [];
  public onlineUsersList: any = [];
  public events: any = [];
  public eventsList: any = [];
  public draggedUser: any;
  public remindAgain: boolean = true;
  public arrayOfIds: any = [];

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',

      onClick: ({ event }: { event }): void => {
        this.router.navigate(['/update', event.meetingId]);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',

      onClick: ({ event }: { event }): void => {
        this.router.navigate(['/delete', event.meetingId]);
      }
    },

  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  constructor(
    private appService: AppService,
    private socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modal: NgbModal
  ) { }

  ngOnInit() {

    this.userInfo = this.appService.getUserInfoFromLocalStorage();//getting userInfo which was stored in login component
    if (!this.userInfo.isAdmin) {
      this.router.navigate(['/user/dashboard']);// user will redirected to user dashboard if he is not admin.
    }
    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('receiverId');//getting the authtoken, receiverId, recieverName from cookies which were set in login component.
    this.receiverName = Cookie.get('receiverName');
    this.verifyUserConfirmation();//function to subscribe to the event which verifies user as online.
    this.getOnlineUserList();//function to subscribe to the event to get online user list.
    this.getAdminMeetings(this.receiverId);//calling function to get all the meetings of user.
    this.getAllUsers();//function to get all the normal users of the application. 
    this.draggedUser = this.appService.getSelectedUserInfoFromLocalStorage();// function to get the details of selected user from local storage.
    setInterval(() => {
      this.meetingReminder();// function to send the reminder to the user for meeting through email as well as alert.
    }, 5000);
  }


  dragEnd(event, user) {//this is the event which get the user dragged from userlist. 
    this.draggedUser = user;
    this.appService.setSelectedUserInfoInLocalStorage(this.draggedUser);//set the dragged user in the local storage.
    Cookie.set('receiverId', this.draggedUser.userId);
    Cookie.set('receiverName', `${this.draggedUser.firstName} ${this.draggedUser.lastName}`);//changes the receiverId, recieverName to that of dragged user.

    this.receiverId = this.draggedUser.userId;
    this.receiverName = `${this.draggedUser.firstName} ${this.draggedUser.lastName}`;
    this.getAdminMeetings(this.receiverId);//refresh the calendar to show the meetings with selected(dragged) user.
  }//end dragEnd

  //method remind the user for meeting.
  public meetingReminder = () => {

    let currentTime = new Date().getTime();//gets currentTime

    for (let meeting of this.events) {//loop to check each meeting for the alert message before 1 minute of start time.

      if (isSameDay(new Date(), meeting.start) && new Date(meeting.start).getTime() - currentTime <= 60000
        && new Date(meeting.start).getTime() > currentTime && meeting.status == "snooze") {//check for the date to be same as today &and also the start time is a minute away.
        if (this.remindAgain) {
          this.modalData = { action: 'clicked', event: meeting };//setting the modalData object as required by the calendar module to show alert for the meeting.
          this.modal.open(this.alertContent, { size: 'lg' });
          meeting.email = this.userInfo.email;//seeting the properties required by backend event to send the email to the Admin.
          meeting.firstName = this.userInfo.firstName;
          if (!this.arrayOfIds.includes(meeting.meetingWithId)) {
            meeting.notifyUser = true;//setting the property only if the participant is offline to send him reminder mail of meeting.
          }
          this.socketService.emailNotification(meeting);//call the event function to send the reminder email according to the properties set on object.
          this.remindAgain = false;//this flag will control the snooze behaviour.
          break;
        }//end inner if
      }//end if
    }//end for
  }//end meetingreminder

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {

        this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.

      });//end subscribe
  }//end verifyUserConfirmation

  public deSelectUser = () => {//this function is deselecting the dragged user by setting to undefined.

    Cookie.set('receiverId', this.userInfo.userId);
    Cookie.set('receiverName', `${this.userInfo.firstName} ${this.userInfo.lastName}`);//changing the cookies to userInfo object.
    this.receiverId = this.userInfo.userId;
    this.receiverName = `${this.userInfo.firstName} ${this.userInfo.lastName}`;
    this.getAdminMeetings(this.receiverId);//calling the getmeetings function to get the meetings of admin.
    this.draggedUser = undefined;
    this.appService.setSelectedUserInfoInLocalStorage('');//setting the localstorage of slected user to empty string.

  } //end deseclectUser 
  //method to get all non-admin users.
  public getAllUsers = () => {//this function will get all the normal users from database. 
    this.appService.getUsers().subscribe(//using the apiget all normal users.
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.allUsers = apiResponse.data;
          this.getOnlineUserList();
          this.checkStatus();//onsuccessfull fetch of normal user checking their status as online/offilne using this function anf onlineuser list.
          this.toastr.info("Update", "All users listed");
        }
        else {
          this.toastr.error(apiResponse.message);
          //this.router.navigate(['/serverError']);//in case of error redirecting to error page.
        }
      },
      (error) => {
        this.toastr.error('Server error occured');
        this.router.navigate(['/serverError']);//in case of error redirecting to error page.
      }
    );
  }//end getAllUsers

  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList()//will update the onlineUserlist whenever user logged in/out.
      .subscribe((userListfromdb) => {

        this.onlineUsersList = [];
        this.arrayOfIds = [];
        for (let x in userListfromdb) {
          let temp = { 'userId': x, 'name': userListfromdb[x] };
          this.onlineUsersList.push(temp);
          this.arrayOfIds.push(temp.userId);//pushing the ids of all the online user to array.
        }
        Cookie.set('arrayOfIds', this.arrayOfIds);//setting the online user's ids to cookie to maintain the state
        this.checkStatus();//call the function to update the noraml userlist which is displayed.
      });//end subscribe

  }//end getOnlineUserList
  public checkStatus: any = () => {

    this.arrayOfIds = Cookie.get('arrayOfIds');
    for (let y of this.allUsers) {
      if (this.arrayOfIds.includes(y.userId)) {
        y.status1 = "online";//set the status1 property based on the presence of userId in arrayofId's
      }
      else {
        y.status1 = "offline";//the status1 property is used to display the red or green dot accordingly.
      }

      if (this.draggedUser != undefined && this.draggedUser != ' ' && this.draggedUser != null) {//check whether is draggeduser is present or not.
        if (this.draggedUser.userId == y.userId) {
          if (this.draggedUser.status1 != y.status1) {//if the status of the dragged user is different from what it is in alluser list then update it in local storage as well as real time.
            this.draggedUser = y;
            this.appService.setSelectedUserInfoInLocalStorage(y);
          }
        }
      }
    }
  }//end checkStatus

  //method to get all meetings of Admin
  public getAdminMeetings = (iD = this.userInfo.userId) => {

    this.appService.getMeetings(iD).subscribe(//uses the api call to get metting of selected user passed as userId.
      (apiResponse) => {

        if (apiResponse.status == 200) {
          this.eventsList = apiResponse.data;
          let i = 0;
          for (let meeting of this.eventsList) {
            meeting.start = new Date(meeting.startDate);//changes the date from number of milliseconds to human readable format.
            meeting.end = new Date(meeting.endDate);
            meeting.status = "snooze";
            meeting.mails = 0;
            meeting.actions = this.actions;//sets the actions available on the meetings (edit, delete meeting)
            meeting.color = colors[i];//sets the colors from array of colors object.
            (i == 2) ? i = 0 : i++;
          }//end for
          this.events = this.eventsList;
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      },
      (error) => {
        this.toastr.error('Server Error Occured');
        this.router.navigate(['/serverError']);//redirects to error page incase of error.
      }
    );
  }//end getAdminMeetings

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {//this function is called when a particular day is clicked .

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;//this set the active day open as false means that current day is not selected.
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }//end dayClicked

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {

    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  public logout = () => {//this function is called to log user out of the application

    this.appService.logout().subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete('authToken');//delete all the cookies
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          Cookie.delete('arrayOfIds');
          this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.
          this.socketService.exitSocket();//this method will disconnect the socket from frontend and close the connection with the server.
          this.router.navigate(['/login']);//redirects the user to login page.
        } else {
          this.toastr.error(apiResponse.message)
          this.router.navigate(['/serverError']);//in case of error redirects to error page.
        } // end condition
      },
      (err) => {
        this.toastr.error('Server error occured')
        this.router.navigate(['/serverError']);//in case of error redirects to error page.
      });

  }//end logout
}