import { Component, OnInit } from '@angular/core';

//for routing
import { ActivatedRoute, Router } from '@angular/router';
//import for services
import { AppService } from '../app.service';
import { SocketService } from '../socket.service';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-general-dashboard',
  templateUrl: './general-dashboard.component.html',
  styleUrls: ['./general-dashboard.component.css']
})
export class GeneralDashboardComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;//getting the template refrence to control the modal as per need.
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
  public dubEvents: any = [];
  public eventsList: any = [];
  public remindAgain: boolean = true;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

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
    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('receiverId');//getting the authtoken, receiverId, recieverName from cookies which were set in login component.
    this.receiverName = Cookie.get('receiverName');

    this.verifyUserConfirmation();//function to subscribe to the event which verifies user as online.
    this.getMeetings(this.receiverId);//function to load all the meetings of the user from the database.

    setInterval(()=>{
      this.meetingReminder();//function to send the reminder of the meeting over email as well as on screnn.
    },5000);
    this.getToastMessage();//this metod subscribes the to event which gives the user toast message as received from admin.
  }

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {

        this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.

      });//end subscribe
  }//end verifyUserConfirmation

  public getToastMessage= () =>{

    this.socketService.messageFromAdmin(this.receiverId).subscribe((data) =>{//getting message from admin.
      this.getMeetings(this.receiverId);
      this.toastr.info("Update",data.toast);
    });
  }

  //method remind the user for meeting.
  public meetingReminder = () => {

    let currentTime = new Date().getTime();

    for (let meeting of this.events) {

      if (isSameDay(new Date(), meeting.start) && new Date(meeting.start).getTime() - currentTime <= 60000
        && new Date(meeting.start).getTime() > currentTime && meeting.status == "snooze") {
        if (this.remindAgain) {

          this.modalData = { action: 'clicked', event: meeting };
          this.modal.open(this.alertContent, { size: 'lg' });
          meeting.email = this.userInfo.email;
          meeting.firstName = this.userInfo.firstName;
          this.socketService.emailNotification(meeting);
          this.remindAgain = false;
          break;
        }//end inner if
      }//end if
    }//end for
  }//end meetingreminder

  //method to get all meetings of user
  public getMeetings = (iD=this.userInfo.userId) => {
    
    this.appService.getMeetings(iD).subscribe(
      (apiResponse) => {
        
        if (apiResponse.status == 200) {
          this.eventsList = apiResponse.data;
          let i = 0;
          for (let meeting of this.eventsList) {
            meeting.start = new Date(meeting.startDate);
            meeting.end = new Date(meeting.endDate); 
            meeting.status = "snooze";
            meeting.color = colors[i];
            (i == 3) ? i = 0 : i++;
          }//end for
          this.events = this.eventsList;
        }
        else if(apiResponse.message == "No Meetings Found"){
          this.events = [];
        }
        else {
          this.toastr.error(apiResponse.message);
          this.router.navigate(['/serverError']);
        }
      },
      (error) => {
        this.toastr.error('Server Error Occured');
        this.router.navigate(['/serverError']);
      }
    );
  }//end getAdminMeetings

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
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
    console.log(event)
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  public logout = () => {

    this.appService.logout().subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          console.log("logout called")
          localStorage.clear();
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          this.socketService.disconnectedSocket();
          this.socketService.exitSocket();
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(apiResponse.message)
          this.router.navigate(['/serverError']);
        } // end condition
      },
      (err) => {
        this.toastr.error('Server error occured')
        this.router.navigate(['/serverError']);
      });

  }//end logout
}

