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
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  public hostName: string;
  public hostId: string;
  public startDate1: any;
  public endDate1: any;
  public title: string;
  public purpose: string;
  public venue: string;
  public meetingWithId: string;
  public meetingWithName: string;
  public userInfo:any;

  constructor(
    private appService: AppService,
    private socketService: SocketService,
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) { }

  ngOnInit() {

    this.meetingWithId = Cookie.get('receiverId');
    this.meetingWithName = Cookie.get('receiverName');//getting the receiverId, name to use as the meeting partners.
    this.userInfo = this.appService.getUserInfoFromLocalStorage();//getting the details of the admin from local storage.
    if(!this.userInfo.isAdmin){
      this.router.navigate(['/user/dashboard']);//checking is the user reached here is not admin then redirect to normal user dashboard.
    }
    this.hostId = this.userInfo.userId;
    this.hostName = `${this.userInfo.firstName} ${this.userInfo.lastName}`;

  }


  public validateDate(startDate:any, endDate:any):boolean {//method to validate the the start and end date of meeting .

    let start = new Date(startDate);
    let end = new Date(endDate);

    if(end < start){
      return true;
    }
    else{
      return false;
    }

  }//end validateDate

  public scheduleMeeting(){// this method sechedule the meeting using the api provided.

    let data:any = { };

    data.hostId = this.hostId;
    data.hostName = this.hostName;
    data.startDate = this.startDate1.getTime();
    data.endDate = this.endDate1.getTime();//changing the date&time to number of miliseconds before sending to database.
    data.title = this.title;
    data.purpose = this.purpose;
    data.venue = this.venue;
    data.meetingWithId = this.meetingWithId;
    data.meetingWithName = this.meetingWithName;

    this.appService.arrangeMeeting(data)
      .subscribe((apiResponse) => {

        if(apiResponse.status == 200){
          this.toastr.success("Success!","Meeting Scheduled");//if succesfull sending the message and email to meeting partner
          let message:any ={ 
            toast: `Hi, Meeting has Scheduled with ${apiResponse.data.hostName}. For more details check your calendar.`,
            userId: data.meetingWithId
        };
          
          this.socketService.notifyUser(message);
          apiResponse.data.type = 'create';//setting the property to choose the write message before sending an email to meeting partner. 
          this.socketService.emailNotification(apiResponse.data);
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);  //redirecting to admin dashboard.
          }, 1000);
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      },
      (error) => {
        this.toastr.error("Some error occured");//error page in case of error.
      });//end subscribe
  }//end schdeuleMeeting

  //goBack Method
  public goBack(): any {//method using the location service to get user back to page from where he reached this page.
    this.location.back();
  }//end goBackMethod
}
