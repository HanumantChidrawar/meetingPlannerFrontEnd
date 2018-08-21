import { Component, OnInit } from '@angular/core';

//for routing
import { ActivatedRoute, Router } from '@angular/router';
//import for services
import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';


@Component({
  selector: 'app-delete-meeting',
  templateUrl: './delete-meeting.component.html',
  styleUrls: ['./delete-meeting.component.css']
})
export class DeleteMeetingComponent implements OnInit {

  public hostName: string;
  public hostId: string;
  public startDate: Date;
  public endDate: Date;
  public title: string;
  public purpose: string;
  public venue: string;
  public meetingWithId: string;
  public meetingWithName: string;
  public userInfo: any;
  public meetingId: string;
  public meetingDetails: any;

  constructor(
    private appService: AppService,
    private socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    this.meetingWithId = Cookie.get('receiverId');//getting the receiverId, name to use as the meeting partners.
    this.meetingWithName = Cookie.get('receiverName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();//getting the details of the admin from local storage.
    if(!this.userInfo.isAdmin){
      this.router.navigate(['/user/dashboard']);//checking is the user reached here is not admin then redirect to normal user dashboard.
    }
    this.meetingId = this._route.snapshot.params['meetingId'];
    this.hostId = this.userInfo.userId;
    this.hostName = `${this.userInfo.firstName} ${this.userInfo.lastName}`;

    this.getMeeting();
  }

  public getMeeting() {

    this.appService.getMeeting(this.meetingId)
      .subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.hostId = apiResponse.data.hostId;
          this.hostName = apiResponse.data.hostName;
          this.meetingWithId = apiResponse.data.meetingWithId;
          this.meetingWithName = apiResponse.data.meetingWithName;
          this.startDate = new Date(apiResponse.data.startDate);
          this.endDate = new Date(apiResponse.data.endDate);
          this.title = apiResponse.data.title;
          this.venue = apiResponse.data.venue;
          this.purpose = apiResponse.data.purpose;
          this.meetingWithId = apiResponse.data.meetingWithId;
          this.meetingWithName = apiResponse.data.meetingWithName;
          this.hostId = apiResponse.data.hostId;
          this.hostName = apiResponse.data.hostName;
          this.meetingDetails = apiResponse.data;
          this.meetingDetails.type = 'delete';
        }
      });//end subscribe
  }//end getMeeting

  public deleteMeeting() {

    this.appService.deleteMeeting(this.meetingId)
      .subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.info("Deleted!", "Meeting Cancelled");
          let message:any ={ 
            toast: `Hi, Meeting has Cancelled with ${this.meetingDetails.hostName}. For more details check your calendar.`,
            userId: this.meetingDetails.meetingWithId
        };
          this.socketService.notifyUser(message);
          this.socketService.emailNotification(this.meetingDetails);
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);  
          }, 1000);
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      },
      (error) => {
          this.toastr.error("Some error occured");
    });//end subscribe
  }//end Delete method

//goBack Method
public goBack(): any {
  this.location.back();
}//end goBackMethod
}
