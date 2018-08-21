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
  selector: 'app-update-meeting',
  templateUrl: './update-meeting.component.html',
  styleUrls: ['./update-meeting.component.css']
})
export class UpdateMeetingComponent implements OnInit {

  public hostName: string;
  public hostId: string;
  public startDate: Date;
  public endDate: Date;
  public title: string;
  public purpose: string;
  public venue: string;
  public meetingWithId: string;
  public meetingWithName: string;
  public userInfo:any;
  public meetingId: string;

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
    this.meetingWithName = Cookie.get('receiverName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    if(!this.userInfo.isAdmin){
      this.router.navigate(['/user/dashboard']);
    }
    this.meetingId = this._route.snapshot.params['meetingId'];
    this.hostId = this.userInfo.userId;
    this.hostName = `${this.userInfo.firstName} ${this.userInfo.lastName}`;

    this.getMeeting();

  }

  public getMeeting(){

    this.appService.getMeeting(this.meetingId)
      .subscribe((apiResponse)=>{

        if(apiResponse.status == 200){
          this.startDate = new Date(apiResponse.data.startDate);
          this.endDate = new Date(apiResponse.data.endDate);
          this.title = apiResponse.data.title;
          this.venue = apiResponse.data.venue;
          this.purpose = apiResponse.data.purpose;
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      },
      (error) => {
        this.toastr.error("Some error occured");
      });//end subscribe
  }//end getMeeting

  public validateDate(startDate:any, endDate:any):boolean {

    let start = new Date(startDate);
    let end = new Date(endDate);

    if(end < start){
      return true;
    }
    else{
      return false;
    }

  }//end validateDate

  public reScheduleMeeting(){

    let data:any = { };

    data.hostId = this.hostId;
    data.hostName = this.hostName;
    data.startDate = this.startDate.getTime();
    data.endDate = this.endDate.getTime();
    data.title = this.title;
    data.purpose = this.purpose;
    data.venue = this.venue;
    data.meetingWithId = this.meetingWithId;
    data.meetingWithName = this.meetingWithName;
    data.meetingId = this.meetingId;

    this.appService.updateMeeting(data)
      .subscribe((apiResponse) => {
        if(apiResponse.status == 200){
          this.toastr.success("Success!","Meeting Re-Scheduled");
          let message:any ={ 
            toast: `Hi, Meeting has Re-Scheduled with ${data.hostName}. For more details check your calendar.`,
            userId: data.meetingWithId
        };
          this.socketService.notifyUser(message);
          data.type = 'update';
          this.socketService.emailNotification(data);
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
  }//end reSchdeuleMeting

  //goBack Method
  public goBack(): any {
    this.location.back();
  }//end goBackMethod
  
}
